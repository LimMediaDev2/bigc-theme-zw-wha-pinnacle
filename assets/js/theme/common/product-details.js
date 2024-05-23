import utils from '@bigcommerce/stencil-utils';
import ProductDetailsBase, { optionChangeDecorator } from './product-details-base';
import 'foundation-sites/js/foundation/foundation';
import 'foundation-sites/js/foundation/foundation.reveal';
import ImageGallery from '../product/image-gallery';
import modalFactory, { showAlertModal } from '../global/modal';
import _ from 'lodash';
import { isEmpty, isPlainObject } from 'lodash';
import { normalizeFormData } from './utils/api';
import { isBrowserIE, convertIntoArray } from './utils/ie-helpers';
import bannerUtils from './utils/banner-utils';
import Wishlist from '../wishlist';

import { getDataFromGraphql } from './graphQLService';

/**
 * IntuitSolutions.net - Interval Quantity
 * LimMedia.io
 */
import IntervalQuantity from '../custom/interval-quantity';
export default class ProductDetails extends ProductDetailsBase {
    constructor($scope, context, productAttributesData = {}) {
        super($scope, context);

        this.$overlay = $('[data-cart-item-add] .loadingOverlay');
        this.imageGallery = new ImageGallery($('[data-image-gallery]', this.$scope));
        this.imageGallery.init();
        this.listenQuantityChange();
        this.$swatchOptionMessage = $('.swatch-option-message');
        this.swatchOptionMessageInitText = this.$swatchOptionMessage.text();

        this.$priceTotalSection = $('.priceTotal', this.$scope);
        this.$priceTotal = $('.priceTotal .priceTotal-value', this.$scope);
        this.$productQtyEl = $('.form-input--incrementTotal', this.$scope);

        this.$productPriceEl = $('.price.price--withoutTax', this.$scope);

        const $form = $('form[data-cart-item-add]', $scope);
        const $productOptionsElement = $('[data-product-option-change]', $form);
        const hasOptions = $productOptionsElement.html().trim().length;
        const hasDefaultOptions = $productOptionsElement.find('[data-default]').length;
        const $productSwatchGroup = $('[id*="attribute_swatch"]', $form);
        const $productSwatchLabels = $('.form-option-swatch', $form);
        const placeSwatchLabelImage = (_, label) => {
            const $optionImage = $('.form-option-expanded', $(label));
            const optionImageWidth = $optionImage.outerWidth();
            const extendedOptionImageOffsetLeft = 55;
            const { right } = label.getBoundingClientRect();
            const emptySpaceToScreenRightBorder = window.screen.width - right;
            const shiftValue = optionImageWidth - emptySpaceToScreenRightBorder;

            if (emptySpaceToScreenRightBorder < (optionImageWidth + extendedOptionImageOffsetLeft)) {
                $optionImage.css('left', `${shiftValue > 0 ? -shiftValue : shiftValue}px`);
            }
        };

        $(window).on('load', () => $.each($productSwatchLabels, placeSwatchLabelImage));

        if (context.showSwatchNames) {
            this.$swatchOptionMessage.removeClass('u-hidden');
            $productSwatchGroup.on('change', ({ target }) => this.showSwatchNameOnOption($(target)));

            $.each($productSwatchGroup, (_, element) => {
                if ($(element).is(':checked')) this.showSwatchNameOnOption($(element));
            });
        }

        $productOptionsElement.on('change', event => {
            this.productOptionsChanged(event);
            this.setProductVariant();
        });

        $form.on('submit', event => {
            this.addProductToCart(event, $form[0]);
        });

        // Update product attributes. Also update the initial view in case items are oos
        // or have default variant properties that change the view
        if ((isEmpty(productAttributesData) || hasDefaultOptions) && hasOptions) {
            const $productId = $('[name="product_id"]', $form).val();
            const optionChangeCallback = optionChangeDecorator.call(this, hasDefaultOptions);

            utils.api.productAttributes.optionChange($productId, $form.serialize(), optionChangeCallback);
        } else {
            this.updateProductAttributes(productAttributesData);
            bannerUtils.dispatchProductBannerEvent(productAttributesData);
        }

        $productOptionsElement.show();

        this.previewModal = modalFactory('#previewModal')[0];

        /**
         * IntuitSolutions.net - Interval Quantity
         * LimMedia.io
         */
        this.interval = new IntervalQuantity(this.$scope);
        this.originalPrice = parseFloat(this.$productPriceEl.html().replace(/\$|,/g, ''), 10)
        this.getBulkPricing();
    }

    setProductVariant() {
        const unsatisfiedRequiredFields = [];
        const options = [];

        $.each($('[data-product-attribute]'), (index, value) => {
            const optionLabel = value.children[0].innerText;
            const optionTitle = optionLabel.split(':')[0].trim();
            const required = optionLabel.toLowerCase().includes('required');
            const type = value.getAttribute('data-product-attribute');

            if ((type === 'input-file' || type === 'input-text' || type === 'input-number') && value.querySelector('input').value === '' && required) {
                unsatisfiedRequiredFields.push(value);
            }

            if (type === 'textarea' && value.querySelector('textarea').value === '' && required) {
                unsatisfiedRequiredFields.push(value);
            }

            if (type === 'date') {
                const isSatisfied = Array.from(value.querySelectorAll('select')).every((select) => select.selectedIndex !== 0);

                if (isSatisfied) {
                    const dateString = Array.from(value.querySelectorAll('select')).map((x) => x.value).join('-');
                    options.push(`${optionTitle}:${dateString}`);

                    return;
                }

                if (required) {
                    unsatisfiedRequiredFields.push(value);
                }
            }

            if (type === 'set-select') {
                const select = value.querySelector('select');
                const selectedIndex = select.selectedIndex;

                if (selectedIndex !== 0) {
                    options.push(`${optionTitle}:${select.options[selectedIndex].innerText}`);

                    return;
                }

                if (required) {
                    unsatisfiedRequiredFields.push(value);
                }
            }

            if (type === 'set-rectangle' || type === 'set-radio' || type === 'swatch' || type === 'input-checkbox' || type === 'product-list') {
                const checked = value.querySelector(':checked');
                if (checked) {
                    const getSelectedOptionLabel = () => {
                        const productVariantslist = convertIntoArray(value.children);
                        const matchLabelForCheckedInput = inpt => inpt.dataset.productAttributeValue === checked.value;
                        return productVariantslist.filter(matchLabelForCheckedInput)[0];
                    };
                    if (type === 'set-rectangle' || type === 'set-radio' || type === 'product-list') {
                        const label = isBrowserIE ? getSelectedOptionLabel().innerText.trim() : checked.labels[0].innerText;
                        if (label) {
                            options.push(`${optionTitle}:${label}`);
                        }
                    }

                    if (type === 'swatch') {
                        const label = isBrowserIE ? getSelectedOptionLabel().children[0] : checked.labels[0].children[0];
                        if (label) {
                            options.push(`${optionTitle}:${label.title}`);
                        }
                    }

                    if (type === 'input-checkbox') {
                        options.push(`${optionTitle}:Yes`);
                    }

                    return;
                }

                if (type === 'input-checkbox') {
                    options.push(`${optionTitle}:No`);
                }

                if (required) {
                    unsatisfiedRequiredFields.push(value);
                }
            }
        });

        let productVariant = unsatisfiedRequiredFields.length === 0 ? options.sort().join(', ') : 'unsatisfied';
        const view = $('.productView');

        if (productVariant) {
            productVariant = productVariant === 'unsatisfied' ? '' : productVariant;
            if (view.attr('data-event-type')) {
                view.attr('data-product-variant', productVariant);
            } else {
                const productName = view.find('.productView-title')[0].innerText.replace(/"/g, '\\$&');
                const card = $(`[data-name="${productName}"]`);
                card.attr('data-product-variant', productVariant);
            }
        }
    }

    /**
     * Checks if the current window is being run inside an iframe
     * @returns {boolean}
     */
    isRunningInIframe() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    /**
     *
     * Handle product options changes
     *
     */
    productOptionsChanged(event) {
        const $changedOption = $(event.target);
        const $form = $changedOption.parents('form');
        const productId = $('[name="product_id"]', $form).val();

        // Do not trigger an ajax request if it's a file or if the browser doesn't support FormData
        if ($changedOption.attr('type') === 'file' || window.FormData === undefined) {
            return;
        }

        utils.api.productAttributes.optionChange(productId, $form.serialize(), async (err, response) => {
            const res = await response;
            const productAttributesData = res.data || {};
            const productAttributesContent = res.content || {};
            this.updateProductAttributes(productAttributesData);
            this.updateView(productAttributesData, productAttributesContent);
            bannerUtils.dispatchProductBannerEvent(productAttributesData);
            this.updatePriceTotal();
        });
    }

    /**
     * if this setting is enabled in Page Builder
     * show name for swatch option
     */
    showSwatchNameOnOption($swatch) {
        const swatchName = $swatch.attr('aria-label');

        $('[data-product-attribute="swatch"] [data-option-value]').text(swatchName);
        this.$swatchOptionMessage.text(`${this.swatchOptionMessageInitText} ${swatchName}`);
        this.setLiveRegionAttributes(this.$swatchOptionMessage, 'status', 'assertive');
    }

    setLiveRegionAttributes($element, roleType, ariaLiveStatus) {
        $element.attr({
            role: roleType,
            'aria-live': ariaLiveStatus,
        });
    }

    showProductImage(image) {
        if (_.isPlainObject(image)) {
            const zoomImageUrl = utils.tools.image.getSrc(
                image.data,
                this.context.themeSettings.zoom_size,
            );

            const mainImageUrl = utils.tools.image.getSrc(
                image.data,
                this.context.themeSettings.product_size,
            );

            this.imageGallery.setAlternateImage({
                mainImageUrl,
                zoomImageUrl,
            });
        } else {
            this.imageGallery.restoreImage();
        }
    }

    /**
     *
     * Handle action when the shopper clicks on + / - for quantity
     *
     */
    // listenQuantityChange() {
    //     this.$scope.on('click', '[data-quantity-change] button', event => {
    //         event.preventDefault();
    //         const $target = $(event.currentTarget);
    //         const viewModel = this.getViewModel(this.$scope);
    //         const $input = viewModel.quantity.$input;
    //         const quantityMin = parseInt($input.data('quantityMin'), 10);
    //         const quantityMax = parseInt($input.data('quantityMax'), 10);

    //         let qty = parseInt($input.val(), 10);

    //         // If action is incrementing
    //         if ($target.data('action') === 'inc') {
    //             // If quantity max option is set
    //             if (quantityMax > 0) {
    //                 // Check quantity does not exceed max
    //                 if ((qty + 1) <= quantityMax) {
    //                     qty++;
    //                 }
    //             } else {
    //                 qty++;
    //             }
    //         } else if (qty > 1) {
    //             // If quantity min option is set
    //             if (quantityMin > 0) {
    //                 // Check quantity does not fall below min
    //                 if ((qty - 1) >= quantityMin) {
    //                     qty--;
    //                 }
    //             } else {
    //                 qty--;
    //             }
    //         }

    //         // update hidden input
    //         viewModel.quantity.$input.val(qty);
    //         // update text
    //         viewModel.quantity.$text.text(qty);
    //         // update total price value
    //         this.updatePriceTotal(qty);
    //     });

    //     // Prevent triggering quantity change when pressing enter
    //     this.$scope.on('keypress', '.form-input--incrementTotal', event => {
    //         // If the browser supports event.which, then use event.which, otherwise use event.keyCode
    //         const x = event.which || event.keyCode;
    //         if (x === 13) {
    //             // Prevent default
    //             event.preventDefault();
    //         }
    //     });
    // }

    /**
     * IntuitSolutions.net - Interval Quantity
     * LimMedia.io
     */
    listenQuantityChange() {
        this.$scope.on('click', '[data-quantity-change] button', event => {
            event.preventDefault();
            this.interval.handleQuantityChange(event);
            this.updatePriceTotal();
        });

        // Prevent triggering quantity change when pressing enter
        this.$scope.on('keypress', '.form-input--incrementTotal', event => {
            // If the browser supports event.which, then use event.which, otherwise use event.keyCode
            const x = event.which || event.keyCode;
            if (x === 13) {
                // Prevent default
                event.preventDefault();
                this.updatePriceTotal();
            }
        });
    }

    /**
     *
     * Add a product to cart
     *
     */
    addProductToCart(event, form) {
        const $addToCartBtn = $('#form-action-addToCart', $(event.target));
        const originalBtnVal = $addToCartBtn.val();
        const waitMessage = $addToCartBtn.data('waitMessage');

        // Do not do AJAX if browser doesn't support FormData
        if (window.FormData === undefined) {
            return;
        }

        // Prevent default
        event.preventDefault();

        $addToCartBtn
            .val(waitMessage)
            .prop('disabled', true);

        this.$overlay.show();

        // Add item to cart
        utils.api.cart.itemAdd(normalizeFormData(new FormData(form)), (err, response) => {
            const errorMessage = err || response.data.error;

            $addToCartBtn
                .val(originalBtnVal)
                .prop('disabled', false);

            this.$overlay.hide();

            // Guard statement
            if (errorMessage) {
                // Strip the HTML from the error message
                const tmp = document.createElement('DIV');
                tmp.innerHTML = errorMessage;

                return showAlertModal(tmp.textContent || tmp.innerText);
            }

            // Open preview modal and update content
            if (this.previewModal) {
                this.previewModal.open();

                if ($addToCartBtn.parents('.quickView').length === 0) this.previewModal.$preModalFocusedEl = $addToCartBtn;
                this.updateCartContent(this.previewModal, response.data.cart_item.id, () => this.previewModal.setupFocusTrap());
            } else {
                this.$overlay.show();
                // if no modal, redirect to the cart page
                this.redirectTo(response.data.cart_item.cart_url || this.context.urls.cart);
            }
        });

        this.setLiveRegionAttributes($addToCartBtn.next(), 'status', 'polite');
    }

    /**
     * Get cart contents
     *
     * @param {String} cartItemId
     * @param {Function} onComplete
     */
    getCartContent(cartItemId, onComplete) {
        const options = {
            template: 'cart/preview',
            params: {
                suggest: cartItemId,
            },
            config: {
                cart: {
                    suggestions: {
                        limit: 4,
                    },
                },
            },
        };

        utils.api.cart.getContent(options, onComplete);
    }

    /**
     * Redirect to url
     *
     * @param {String} url
     */
    redirectTo(url) {
        if (this.isRunningInIframe() && !window.iframeSdk) {
            window.top.location = url;
        } else {
            window.location = url;
        }
    }

    /**
     * Update cart content
     *
     * @param {Modal} modal
     * @param {String} cartItemId
     * @param {Function} onComplete
     */
    updateCartContent(modal, cartItemId, onComplete) {
        this.getCartContent(cartItemId, (err, response) => {
            if (err) {
                return;
            }

            modal.updateContent(response);

            // Update cart counter
            const $body = $('body');
            const $cartQuantity = $('[data-cart-quantity]', modal.$content);
            const $cartCounter = $('.navUser-action .cart-count');
            const quantity = $cartQuantity.data('cartQuantity') || 0;
            const $promotionBanner = $('[data-promotion-banner]');
            const $backToShopppingBtn = $('.previewCartCheckout > [data-reveal-close]');
            const $modalCloseBtn = $('#previewModal > .modal-close');
            const bannerUpdateHandler = () => {
                const $productContainer = $('#main-content > .container');

                $productContainer.append('<div class="loadingOverlay pdp-update"></div>');
                $('.loadingOverlay.pdp-update', $productContainer).show();
                window.location.reload();
            };

            $cartCounter.addClass('cart-count--positive');
            $body.trigger('cart-quantity-update', quantity);

            if (onComplete) {
                onComplete(response);
            }

            if ($promotionBanner.length && $backToShopppingBtn.length) {
                $backToShopppingBtn.on('click', bannerUpdateHandler);
                $modalCloseBtn.on('click', bannerUpdateHandler);
            }
        });
    }

    /**
     * Hide or mark as unavailable out of stock attributes if enabled
     * @param  {Object} data Product attribute data
     */
    updateProductAttributes(data) {
        super.updateProductAttributes(data);
        this.showProductImage(data.image);
    }

    async getBulkPricing() {
        const productId = $('[name="product_id"]', this.$scope).val();
        await getDataFromGraphql('getProductData', this.context.sfToken, { id: productId, fields: `
            prices {
                bulkPricing {
                    ... on BulkPricingFixedPriceDiscount {
                        price
                        minimumQuantity
                        maximumQuantity
                    }
                    ... on BulkPricingPercentageDiscount {
                        percentOff
                        minimumQuantity
                        maximumQuantity
                    }
                    ... on BulkPricingRelativePriceDiscount {
                        priceAdjustment
                        minimumQuantity
                        maximumQuantity
                    }
                }
            }
        `}).then(data => {
            this.bulkPrices = data?.prices?.bulkPricing;
            this.updatePriceTotal();
        });
    }

    adjustPrice(productPrice, qty) {
        let priceDiff = 0;

        if (this.originalPrice > productPrice) {
            priceDiff = parseFloat(this.originalPrice - productPrice);
        } else {
            priceDiff = parseFloat(productPrice - this.originalPrice);  
        }

        if (!this.bulkPrices || this.bulkPrices.length === 0) return (priceDiff + productPrice);

        const bulkPrice = this.bulkPrices.reduce((prev, item) => {
            return item.minimumQuantity && qty >= item.minimumQuantity && item.minimumQuantity > prev.minimumQuantity ? item : prev;
        }, { minimumQuantity: 1 });

        if (bulkPrice.minimumQuantity == 1 && typeof bulkPrice.maximumQuantity === 'undefined') {
            priceDiff = 0;
        }

        // Case of BulkPricingRelativePriceDiscount
        if (bulkPrice.priceAdjustment) {
            return (priceDiff + (productPrice - bulkPrice.priceAdjustment)).toFixed(2);
        }
        // Case of BulkPricingPercentageDiscount
        else if (bulkPrice.percentOff) {
            return (priceDiff + (productPrice - ((productPrice / 100) * bulkPrice.percentOff))).toFixed(2);
        }
        // Case of BulkPricingFixedPriceDiscount
        else if (bulkPrice.price) {
            return (priceDiff + bulkPrice.price).toFixed(2);
        } else {
            return (priceDiff + productPrice).toFixed(2);
        }
    }

    async updatePriceTotal(qty = null) {
        const productQty = qty || parseInt(this.$productQtyEl.val(), 10);
        let productPrice = parseFloat(this.$productPriceEl.html().replace(/\$|,/g, ''), 10);

        if (productQty && productPrice) {
            productPrice = this.adjustPrice(productPrice, productQty);
            this.$priceTotal.html(`$${(productQty * productPrice).toFixed(2)}`);
            this.$priceTotalSection.show();
        } else {
            this.$priceTotalSection.hide();
        }
    }
}
