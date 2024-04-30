import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';
import swal from 'sweetalert2';
import CartPageUpsellProduct from './cart-page-upsell-product-details';
import makeOptionIdsUnique from './make-options-unique';
import regeneratorRuntime from 'regenerator-runtime';

//  Apr 2019: updated version includes ITS Upsell Suite
const VERSION = '2.0';

export default class CartPageUpsell {
    constructor() {
        console.log('IntuitSolutions.net - Cart Page Upsell', VERSION);

        /**
         * options = 'related', 'similar', 'custom fields'
         * errorDefault = backup mode; only necessary with Upsell Suite
         * -- related = automatically loads related products from a random item in the cart
         * -- similar = automatically loads similar by view products from a random item in the cart
         * -- custom fields = will load the products specified by the cart item's custom fields
         * -- upsell suite = will load products specified by Upsell Suite CSVs
         */
        this.mode = 'custom fields';
        this.errorDefault = 'similar';
        this.showMobileInCarousel = true;
        this.productLimit = 3;

        this.loading = $('#cpu .loadingOverlay');

        utils.api.product.getById = utils.api.product.getById.bind(utils.api.product); // required to keep scope of utils to the utils
        utils.api.getPage = utils.api.getPage.bind(utils.api); // required to keep scope of utils to the utils

        this.bindEvents();
    }

    /**
     * remove duplicate items from array
     *
     * pulled from stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
     * @param {array} upsellTargets - array of items we want to strip out any duplicate items from
     */
    removeDuplicateTargets(upsellTargets) {
        return Array.from(new Set(upsellTargets));
    }

    /**
     * get cart items URLs and Product Ids so we don't try to upsell an item that's already in the cart
     * @param {array} upsellTargets - array of items we want to strip out any cart item matches from
     */
    removeCartItemTargets(upsellTargets) {
        // get all data from the cart items
        const cartItemData = [];
        $('[data-upsell]').toArray().forEach(cartItem => {
            const producturl = $(cartItem).data('product-url').replace(window.location.origin, '') || '';
            const productId = $(cartItem).data('product-id').toString() || '';
            cartItemData.push(producturl, productId);
        });
        // only keep upsell items that aren't within our cartItemData array
        const result = upsellTargets.reduce((upsellItems, upsellitem) => {
            if (cartItemData.indexOf(upsellitem) === -1) {
                upsellItems.push(upsellitem);
            }
            return upsellItems;
        }, []);
        // return result
        return result;
    }

    /**
     * get random int given a max
     */
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    /**
     * automatically load products from the cart item's either related products or similar by view items
     * @param {string} type - "related" or "similar"
     */
    loadAutoTargets(type) {
        const itemIndex = this.getRandomInt($('.cart-item').length); // get random item index (pick random item)
        const itemId = $('.cart-item').eq(itemIndex || 0).data('product-id'); // get product id of that random item
        if (itemId == undefined) {
            return $('#cpu').hide();
        }
        // see if we already ajax'd for these upsell items
        let storedData = JSON.parse(localStorage.getItem(`cpu__items${itemId}`)) || [];
        if (storedData.length) { // if already ajaxed and stored upsell items
            storedData = this.removeDuplicateTargets(storedData); // remove duplicate upsell targets
            storedData = this.removeCartItemTargets(storedData); // remove any upsell targets that match an item already in the cart
            this.loadUpsellTargets(storedData); // load those stored upsell items
        } else { // otherwise
            const opts = {
                template: `custom/cart-page-upsell-targets--${type}`,
                config: {
                    product: {
                        related_products: { limit: 70, },
                        similar_by_views: { limit: 70, },
                    },
                },
            }
            utils.api.product.getById(itemId, opts, (err, res) => { // ajax for the first item's upsell items (suggested products)
                if (err) {
                    return $('#cpu').hide();
                }
                let targets = JSON.parse(res) || [];
                targets = this.removeDuplicateTargets(targets); // remove duplicate upsell targets
                targets = this.removeCartItemTargets(targets); // remove any upsell targets that match an item already in the cart
                localStorage.setItem(`cpu__items${itemId}`, JSON.stringify(targets));
                this.loadUpsellTargets(targets);
            });
        }
    }

    /**
     * returns array of upsell product URLs and/or IDs
     */
    loadCustomFieldTargets() {
        let targets = [];
        $('[data-upsell]').toArray().forEach(cartItem => {
            const upsellItems = $(cartItem).data('upsell');
            if (upsellItems.length) {
                upsellItems
                    .split(',')
                    .forEach(upsellItem => {
                        if (upsellItem.length) {
                            targets.push(upsellItem);
                        }
                    });
            }
        });
        // if mode is set to custom fields but no items have custom fields applied, default to using related products
        if (targets.length === 0) {
            return this.loadAutoTargets('related');
        }
        targets = this.removeDuplicateTargets(targets); // remove duplicate upsell targets
        targets = this.removeCartItemTargets(targets); // remove any upsell targets that match an item already in the cart
        return this.loadUpsellTargets(targets);
    }

    async loadCSVTargets ()    {
        //  get the previously AJAXed products from sessionStorage
        const cpuHTMLtext = sessionStorage.getItem("cpuCards");
        const cpuHTML = upsellSuiteCPU.parseArrayFromString(cpuHTMLtext);
        
        //  if nothing has been downloaded,
        //  revert to backup mode
        if (!cpuHTML.length) return this.loadAutoTargets(this.errorDefault);

        //  display the previouly downloaded products
        cpuHTML.forEach(card => $('#cpu .cpu__list--customfields').append(card.html))

        //  if there is room for more products,
        //  fill the rest of the add-on by
        //  adding products from the CSVs
        //  of products already in the CPU
        let remainingSlots = this.productLimit - cpuHTML.length;
        if (remainingSlots) {
            try {
                let targets = await upsellSuiteCPU.getAdditionalProducts(cpuHTML.map(product => product.product_id), remainingSlots);
                return this.loadUpsellTargets(targets);
            }   catch(err)  {
                console.error("CPU parse error: ", err);
            }
        }
        
        this.applyUpsellHandlers();
        return this.loading.hide();
    }

    /**
     * handle adding items to cart
     */
    addToCart(event) {
        const product = $(event.currentTarget).parents('.cpu__item');
        product.removeClass('hasError'); // remove any error highlighting
        // make sure all options are selected
        if (product.hasClass('hasOptions') && !product.hasClass('hasOptions--selected')) {
            product.hasClass('hasOptions--wired')
                ? $('.qaatx__options', product).slideDown() // if options loaded, just show them
                : this.toggleOptions(event); // options aren't loaded, load them + show them
            product.addClass('hasError');
            $('.cpu__item.isBeingAdded').removeClass('isBeingAdded');
            return swal.fire({
                text: 'Please make sure all required options have been selected',
                icon: 'error',
            });
        }
        // actually add to cart
        this.loading.show();
        const form = $('.cpu__item-form', product);
        
        // Interval Quantity Customization
        const cpuInterval = product.data('cpuInterval') || 1;
        const formData = new FormData(form[0]);
        formData.set('qty[]', cpuInterval);

        utils.api.cart.itemAdd(formData, (err, response) => {
            const errorMessage = err || response.data.error; // take note of errors
            if (errorMessage) { // Guard statement
                // Strip the HTML from the error message
                const tmp = document.createElement('DIV');
                tmp.innerHTML = errorMessage;
                this.loading.hide();
                product.addClass('hasError'); // highlgihht error item
                const errorOffset = product.offset().top;
                $('html, body').animate({ scrollTop: (errorOffset - 20) }, 700); // scroll user to the error product
                // remove class from our 'qued" items
                $('.cpu__item.isBeingAdded').removeClass('isBeingAdded');
                // alert user of error
                return swal.fire({
                    text: tmp.textContent || tmp.innerText,
                    icon: 'error',
                });
            }
            this.loading.hide();
            product.addClass('wasAdded');
            $('.cpu__item-button', product).text('Added to Cart');
            $(document).trigger('cpu-refresh-cart-content');
            // if (product.hasClass('isBeingAdded')) {
            //     product.removeClass('isBeingAdded');
            //     ($('.cpu__item.isBeingAdded') && $('.cpu__item.isBeingAdded').length)
            //         ? $('.cpu__item.isBeingAdded').eq(0).find('.qaatc__addtocart').trigger('click') // trigger submitting next product to the cart
            //         : window.location = '/cart.php';
            // }
        });
    }

    /**
     * when modal option changed we need to sync the "real" form. Sync options selected in scope1 with scope2
     * @param {object} event
     * @param {string} productId
     */
    syncFormOption(event, productId) {
        const opt = $(event.target).parents('.form-field');
        const type = $(opt).data('product-attribute');
        let target = null;
        let targetId = null;
        let value = null;
        switch (type) {
            case 'input-checkbox':
            case 'set-rectangle':
            case 'set-radio':
            case 'product-list':
            case 'swatch':
                target = $('input:checked', opt);
                if (target && target.length) {
                    targetId = target.prop('id').replace(`_${productId}`, '').replace('modal_', '');
                    $(`#${targetId}`).prop('checked', true);
                    $(`#${targetId}`).siblings('input').prop('checked', false);
                } else {
                    targetId = $(event.target).prop('id').replace(`_${productId}`, '').replace('modal_', '');
                }
                break;
            case 'set-select':
                target = $('.form-select', opt);
                targetId = target.prop('id').replace(`_${productId}`, '').replace('modal_', '');
                value = target.val();
                $(`#${targetId}`).val(value);
                break;
            case 'input-text':
            case 'textarea':
                target = $('.form-input', opt);
                targetId = target.prop('id').replace(`_${productId}`, '').replace('modal_', '');
                value = target.val();
                $(`#${targetId}`).val(value);
                break;
        }
        // force update on the "real" form
        $(`#${targetId}`).trigger('change');
    }

    /**
     * Add to cart from modal
     */
    addToCartFromModal(modalContent, product) {
        const modal = modalContent.parents('.cpu__modal');
        if (!modal.hasClass('hasOptions--selected')) {
            return swal.fire({
                text: 'Please make sure all required options have been selected',
                icon: 'error',
                didClose: () => {
                    $('.cpu__item-button--options', product).trigger('click'); // show options again if tried adding to cart before selecting all options
                },
            });
        }
        $('.cpu__item-button--addtocart', product).trigger('click'); // trigger add to cart button click on main product
        swal.close(); // close modal
    }

    /**
     * show and load if needed this product's options
     */
    showOptions(e) {
        const product = $(e.currentTarget).parents('.cpu__item');
        const name = $('.cpu__item-name', product).text();
        const optionMarkup = $('.cpu__item-options', product).html();
        const productId = $('[name="product_id"]', product).val();

        swal.fire({
            title: `Options for ${name}`,
            html: optionMarkup,
            customClass: 'cpu__modal',
            showCloseButton: true,
            showConfirmButton: false,
            onOpen: () => {
                // since the moda lHTML is cloned it doesn't have any handlers applied to it. This handles the "fake" cloned options to update the "real" options
                const modalContent = $(swal.getContent());
                makeOptionIdsUnique(modalContent, productId, 'modal');
                $('[data-cpu-option-change]', modalContent).change(event => {
                    this.syncFormOption(event, productId);
                });
                // trigger default selected options unless there's an error.. then we'll get stuck in a loop
                if (!product.hasClass('hasOptions--error')) {
                    $('[data-cpu-option-change]', modalContent).find('input[type="checkbox"]').trigger('change'); // trigger selected checkbox options to update starting checkbox values
                    $('[data-cpu-option-change]', modalContent).find('input[type="radio"]:checked').trigger('change'); // trigger selected radio options to update starting radio buttons values
                    $('[data-cpu-option-change]', modalContent).find('input[type="text"]').trigger('change'); // trigger update on input text to catch any default values
                    $('[data-cpu-option-change]', modalContent).find('input[type="number"]').trigger('change'); // trigger update on input numbers to catch any default values
                    $('[data-cpu-option-change]', modalContent).find('textarea').trigger('change'); // trigger update on textarea tp catch any default values
                    $('[data-cpu-option-change]', modalContent).find('option:selected').parent().trigger('change'); // trigger selected options to update starting select box values
                }

                // this.optionHandlers[productId].updateOptionView();
                this.optionHandlers[productId].checkOptionsSelected(modalContent);

                    // handle adding to cart from modal
                $('.cpu__item-button--modaladdtocart', modalContent).on('click', () => this.addToCartFromModal(modalContent, product));
            }
        });
    }

    /**
     * apply upsell handlers
     */
    applyUpsellHandlers() {
        this.optionHandlers = {};
        $('.cpu__item.hasOptions').toArray().forEach(product => {
            let thisID = $(product).find('input[name="product_id"]').val();
        this.optionHandlers[thisID] = new CartPageUpsellProduct($(product))}); // handle options for all products w/ options

        $('.cpu__item-button--addtocart').on('click', e => this.addToCart(e)); // manage adding to cart

        $('.cpu__item-button--options').on('click', e => this.showOptions(e)); // manage adding to cart

        this.displayInCarousel();
    }

    /**
     * AJAX the upsell URLs and/or IDs and append where needed
     * @param {array} targets - targets to upsell
     */
    loadUpsellTargets(targets) {
        if (targets.length) {
            targets = targets.slice(0, this.productLimit || targets.length);
            const runQueueInOrder = () => {
                if (targets.length === 0) { // when done all products
                    this.applyUpsellHandlers();
                    return this.loading.hide();
                }
                const target = targets.shift();
                const requestMethod = target.toString().match(/^[0-9]+$/) ? utils.api.product.getById : utils.api.getPage;
                requestMethod(target, { template: 'custom/cart-page-upsell-item' }, (err, response) => {
                    if (err) { return; } // if error
                    $('#cpu .cpu__list--customfields').append(response); // no error, append markup
                    runQueueInOrder(); // run next item
                });
            };
            runQueueInOrder(); // start the loop
        } else {
            $('#cpu').hide();
        }
    }

    /**
     * Add Slick options to product display after loading products,
     * then fire Slick
     */
    displayInCarousel() {
        if (!this.showMobileInCarousel) return;

        //  Add CSS to product cards before firing Slick
        $('.cpu__list').addClass('cpu__list-slick')
        $('.cpu__item').addClass('cpu__item-slick')

        $('.cpu__list').attr('data-slick', `{
            "infinite": true,
            "dots": true,
            "arrows": true,
            "mobileFirst": true,
            "rows": 1,
            "slidesToShow": 1,
            "slidesToScroll": 1,
            "responsive": [
                {
                    "breakpoint": 801,
                    "settings": "unslick"
                }
            ]
        }`);

    }

    /**
     * bind events
     */
    bindEvents() {
        this.loading.show();

        switch (this.mode) {
            case 'related':
                return this.loadAutoTargets('related');
            case 'similar':
                return this.loadAutoTargets('similar');
            case 'custom fields':
                return this.loadCustomFieldTargets();
            case 'upsell suite':
                return this.loadCSVTargets();
        }
    }
}
