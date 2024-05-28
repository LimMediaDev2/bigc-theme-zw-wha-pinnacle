import Wishlist from '../wishlist';
import { initRadioOptions } from './aria';
import { isObject, isNumber } from 'lodash';

const optionsTypesMap = {
    INPUT_FILE: 'input-file',
    INPUT_TEXT: 'input-text',
    INPUT_NUMBER: 'input-number',
    INPUT_CHECKBOX: 'input-checkbox',
    TEXTAREA: 'textarea',
    DATE: 'date',
    SET_SELECT: 'set-select',
    SET_RECTANGLE: 'set-rectangle',
    SET_RADIO: 'set-radio',
    SWATCH: 'swatch',
    PRODUCT_LIST: 'product-list',
};

export function optionChangeDecorator(areDefaultOtionsSet) {
    return async (err, response) => {
        const res = await response;
        const attributesData = res.data || {};
        const attributesContent = res.content || {};

        this.updateProductAttributes(attributesData);

        if (areDefaultOtionsSet) {
            this.updateView(attributesData, attributesContent);
        } else {
            this.updateDefaultAttributesForOOS(attributesData);
        }
    };
}

export default class ProductDetailsBase {
    constructor($scope, context) {
        this.$scope = $scope;
        this.context = context;
        this.initRadioAttributes();
        Wishlist.load(this.context);
        this.getTabRequests();

        $('[data-product-attribute]').each((__, value) => {
            const type = value.getAttribute('data-product-attribute');

            this._makeProductVariantAccessible(value, type);
        });
    }

    _makeProductVariantAccessible(variantDomNode, variantType) {
        switch (variantType) {
        case optionsTypesMap.SET_RADIO:
        case optionsTypesMap.SWATCH: {
            initRadioOptions($(variantDomNode), '[type=radio]');
            break;
        }

        default: break;
        }
    }

    /**
     * Allow radio buttons to get deselected
     */
    initRadioAttributes() {
        $('[data-product-attribute] input[type="radio"]', this.$scope).each((i, radio) => {
            const $radio = $(radio);

            // Only bind to click once
            if ($radio.attr('data-state') !== undefined) {
                $radio.on('click', () => {
                    if ($radio.data('state') === true) {
                        $radio.prop('checked', false);
                        $radio.data('state', false);

                        $radio.trigger('change');
                    } else {
                        $radio.data('state', true);
                    }

                    this.initRadioAttributes();
                });
            }

            $radio.attr('data-state', $radio.prop('checked'));
        });
    }

    /**
     * Hide or mark as unavailable out of stock attributes if enabled
     * @param  {Object} data Product attribute data
     */
    updateProductAttributes(data) {
        const behavior = data.out_of_stock_behavior;
        const inStockIds = data.in_stock_attributes;
        const outOfStockMessage = ` (${data.out_of_stock_message})`;

        if (behavior !== 'hide_option' && behavior !== 'label_option') {
            return;
        }

        $('[data-product-attribute-value]', this.$scope).each((i, attribute) => {
            const $attribute = $(attribute);
            const attrId = parseInt($attribute.data('productAttributeValue'), 10);


            if (inStockIds.indexOf(attrId) !== -1) {
                this.enableAttribute($attribute, behavior, outOfStockMessage);
            } else {
                this.disableAttribute($attribute, behavior, outOfStockMessage);
            }
        });
    }

    /**
     * Check for fragment identifier in URL requesting a specific tab
     */
    getTabRequests() {
        if (window.location.hash && window.location.hash.indexOf('#tab-') === 0) {
            const $activeTab = $('.tabs').has(`[href='${window.location.hash}']`);
            const $tabContent = $(`${window.location.hash}`);

            if ($activeTab.length > 0) {
                $activeTab.find('.tab')
                    .removeClass('is-active')
                    .has(`[href='${window.location.hash}']`)
                    .addClass('is-active');

                $tabContent.addClass('is-active')
                    .siblings()
                    .removeClass('is-active');
            }
        }
    }

    /**
     * Since $productView can be dynamically inserted using render_with,
     * We have to retrieve the respective elements
     *
     * @param $scope
     */
    getViewModel($scope) {
        return {
            $priceAsLowAs: $('[data-product-price-as-low-as]', $scope), /** LimMedia.io */
            $priceWithTax: $('[data-product-price-with-tax]', $scope),
            $priceWithoutTax: $('[data-product-price-without-tax]', $scope),
            rrpWithTax: {
                $div: $('.rrp-price--withTax', $scope),
                $span: $('[data-product-rrp-with-tax]', $scope),
            },
            rrpWithoutTax: {
                $div: $('.rrp-price--withoutTax', $scope),
                $span: $('[data-product-rrp-price-without-tax]', $scope),
            },
            nonSaleWithTax: {
                $div: $('.non-sale-price--withTax', $scope),
                $span: $('[data-product-non-sale-price-with-tax]', $scope),
            },
            nonSaleWithoutTax: {
                $div: $('.non-sale-price--withoutTax', $scope),
                $span: $('[data-product-non-sale-price-without-tax]', $scope),
            },
            priceSaved: {
                $div: $('.price-section--saving', $scope),
                $span: $('[data-product-price-saved]', $scope),
            },
            priceNowLabel: {
                $span: $('.price-now-label', $scope),
            },
            priceLabel: {
                $span: $('.price-label', $scope),
            },
            $weight: $('.productView-info [data-product-weight]', $scope),
            $increments: $('.form-field--increments :input', $scope),
            $addToCart: $('#form-action-addToCart', $scope),
            $wishlistVariation: $('[data-wishlist-add] [name="variation_id"]', $scope),
            stock: {
                $container: $('.form-field--stock', $scope),
                $input: $('[data-product-stock]', $scope),
            },
            sku: {
                $label: $('dt.sku-label', $scope),
                $value: $('[data-product-sku]', $scope),
            },
            upc: {
                $label: $('dt.upc-label', $scope),
                $value: $('[data-product-upc]', $scope),
            },
            quantity: {
                $text: $('.incrementTotal', $scope),
                $input: $('[name=qty\\[\\]]', $scope),
            },
            $bulkPricing: $('.productView-info-bulkPricing', $scope),
        };
    }

    /**
     * Hide the pricing elements that will show up only when the price exists in API
     * @param viewModel
     */
    clearPricingNotFound(viewModel) {
        viewModel.rrpWithTax.$div.hide();
        viewModel.rrpWithoutTax.$div.hide();
        viewModel.nonSaleWithTax.$div.hide();
        viewModel.nonSaleWithoutTax.$div.hide();
        viewModel.priceSaved.$div.hide();
        viewModel.priceNowLabel.$span.hide();
        viewModel.priceLabel.$span.hide();

        if (viewModel.$priceAsLowAs[0]) {
            viewModel.$priceAsLowAs[0].style.display = 'none'; /** LimMedia.io */
        }
    }

    /**
     * Update the view of price, messages, SKU and stock options when a product option changes
     * @param  {Object} data Product attribute data
     */
    updateView(data, content = null) {
        const viewModel = this.getViewModel(this.$scope);

        this.showMessageBox(data.stock_message || data.purchasing_message);

        if (isObject(data.price)) {
            this.updatePriceView(viewModel, data.price, data.sku || '', data.v3_variant_id || '');
        }

        if (isObject(data.weight)) {
            viewModel.$weight.html(data.weight.formatted);
        }

        // Set variation_id if it exists for adding to wishlist
        if (data.variantId) {
            viewModel.$wishlistVariation.val(data.variantId);
        }

        // If SKU is available
        if (data.sku) {
            viewModel.sku.$value.text(data.sku);
            viewModel.sku.$label.show();
        } else {
            viewModel.sku.$label.hide();
            viewModel.sku.$value.text('');
        }

        // If UPC is available
        if (data.upc) {
            viewModel.upc.$value.text(data.upc);
            viewModel.upc.$label.show();
        } else {
            viewModel.upc.$label.hide();
            viewModel.upc.$value.text('');
        }

        // if stock view is on (CP settings)
        if (viewModel.stock.$container.length && isNumber(data.stock)) {
            // if the stock container is hidden, show
            viewModel.stock.$container.removeClass('u-hiddenVisually');

            viewModel.stock.$input.text(data.stock);
        } else {
            viewModel.stock.$container.addClass('u-hiddenVisually');
            viewModel.stock.$input.text(data.stock);
        }

        this.updateDefaultAttributesForOOS(data);

        let newContent = this.updateBulkDiscountTable(data.price, data.bulk_discount_rates);
        let getAsLowAs = this.getAsLowAs(data.price, data.bulk_discount_rates);

        if (data.bulk_discount_rates && newContent) {
            viewModel.$bulkPricing.html(newContent);
            viewModel.$priceAsLowAs.html(getAsLowAs);
            viewModel.$priceAsLowAs.show();
        } else if (typeof (data.bulk_discount_rates) !== 'undefined') {
            viewModel.$bulkPricing.html('');
            viewModel.$priceAsLowAs.html('');
            viewModel.$priceAsLowAs.hide();
        }

        const addToCartWrapper = $('#add-to-cart-wrapper');

        if (addToCartWrapper.is(':hidden') && data.purchasable) {
            addToCartWrapper.show();
        }
    }

    /**
     * Update the view of price, messages, SKU and stock options when a product option changes
     * @param  {Object} data Product attribute data
     */
    updatePriceView(viewModel, price, product_sku /** LimMedia.io */, product_variant_id /** LimMedia.io */) {
        this.clearPricingNotFound(viewModel);

        if (viewModel.$priceAsLowAs[0]) {
            viewModel.$priceAsLowAs[0].dataset.productSku = product_sku; /** LimMedia.io */
            viewModel.$priceAsLowAs[0].dataset.productVariantId = product_variant_id; /** LimMedia.io */
        }

        if (price.with_tax) {
            const updatedPrice = price.price_range ?
                `${price.price_range.min.with_tax.formatted} - ${price.price_range.max.with_tax.formatted}`
                : price.with_tax.formatted;
            viewModel.priceLabel.$span.show();
            viewModel.$priceWithTax.html(updatedPrice);
            viewModel.$priceAsLowAs.html(price.with_tax.formatted); /** LimMedia.io */
        }

        if (price.without_tax) {
            const updatedPrice = price.price_range ?
                `${price.price_range.min.without_tax.formatted} - ${price.price_range.max.without_tax.formatted}`
                : price.without_tax.formatted;
            viewModel.priceLabel.$span.show();
            viewModel.$priceWithoutTax.html(updatedPrice);
            viewModel.$priceAsLowAs.html(price.without_tax.formatted); /** LimMedia.io */
        }

        if (price.rrp_with_tax) {
            viewModel.rrpWithTax.$div.show();
            viewModel.rrpWithTax.$span.html(price.rrp_with_tax.formatted);
            viewModel.$priceAsLowAs.html(price.rrp_with_tax.formatted); /** LimMedia.io */
        }

        if (price.rrp_without_tax) {
            viewModel.rrpWithoutTax.$div.show();
            viewModel.rrpWithoutTax.$span.html(price.rrp_without_tax.formatted);
            viewModel.$priceAsLowAs.html(price.rrp_without_tax.formatted); /** LimMedia.io */
        }

        if (price.saved) {
            viewModel.priceSaved.$div.show();
            viewModel.priceSaved.$span.html(price.saved.formatted);
            viewModel.$priceAsLowAs.html(price.saved.formatted); /** LimMedia.io */
        }

        if (price.non_sale_price_with_tax) {
            viewModel.priceLabel.$span.hide();
            viewModel.nonSaleWithTax.$div.show();
            viewModel.priceNowLabel.$span.show();
            viewModel.nonSaleWithTax.$span.html(price.non_sale_price_with_tax.formatted);
            viewModel.$priceAsLowAs.html(price.non_sale_price_with_tax.formatted); /** LimMedia.io */
        }

        if (price.non_sale_price_without_tax) {
            viewModel.priceLabel.$span.hide();
            viewModel.nonSaleWithoutTax.$div.show();
            viewModel.priceNowLabel.$span.show();
            viewModel.nonSaleWithoutTax.$span.html(price.non_sale_price_without_tax.formatted);
            viewModel.$priceAsLowAs.html(price.non_sale_price_without_tax.formatted); /** LimMedia.io */
        }

        if (viewModel.$priceAsLowAs[0]) {
            viewModel.$priceAsLowAs[0].style.display = 'block'; /** LimMedia.io */
        }
    }

    /**
     * Show an message box if a message is passed
     * Hide the box if the message is empty
     * @param  {String} message
     */
    showMessageBox(message) {
        const $messageBox = $('.productAttributes-message');

        if (message) {
            $('.alertBox-message', $messageBox).text(message);
            $messageBox.show();
        } else {
            $messageBox.hide();
        }
    }

    updateDefaultAttributesForOOS(data) {
        const viewModel = this.getViewModel(this.$scope);
        if (!data.purchasable || !data.instock) {
            viewModel.$addToCart.prop('disabled', true);
            viewModel.$increments.prop('disabled', true);
        } else {
            viewModel.$addToCart.prop('disabled', false);
            viewModel.$increments.prop('disabled', false);
        }
    }

    enableAttribute($attribute, behavior, outOfStockMessage) {
        if (this.getAttributeType($attribute) === 'set-select') {
            return this.enableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
        }

        if (behavior === 'hide_option') {
            $attribute.show();
        } else {
            $attribute.removeClass('unavailable');
        }
    }

    disableAttribute($attribute, behavior, outOfStockMessage) {
        if (this.getAttributeType($attribute) === 'set-select') {
            return this.disableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
        }

        if (behavior === 'hide_option') {
            $attribute.hide(0);
        } else {
            $attribute.addClass('unavailable');
        }
    }

    getAttributeType($attribute) {
        const $parent = $attribute.closest('[data-product-attribute]');

        return $parent ? $parent.data('productAttribute') : null;
    }

    disableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
        const $select = $attribute.parent();

        if (behavior === 'hide_option') {
            $attribute.toggleOption(false);
            // If the attribute is the selected option in a select dropdown, select the first option (MERC-639)
            if ($select.val() === $attribute.attr('value')) {
                $select[0].selectedIndex = 0;
            }
        } else {
            $attribute.attr('disabled', 'disabled');
            $attribute.html($attribute.html().replace(outOfStockMessage, '') + outOfStockMessage);
        }
    }

    enableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
        if (behavior === 'hide_option') {
            $attribute.toggleOption(true);
        } else {
            $attribute.prop('disabled', false);
            $attribute.html($attribute.html().replace(outOfStockMessage, ''));
        }
    }

    /**
     * Custom Bulk Discount Table
     * @author LimMedia.io
     * @param {*} price 
     * @param {*} bulk_discount_rates 
     * @returns 
     */
    updateBulkDiscountTable(price, bulk_discount_rates) {
        if (bulk_discount_rates.length == 0) {
            return '';
        }

        let priceDiff = 0;
        let price_value = 0;
        
        if (!(typeof price.with_tax === 'undefined')) {
            price_value = price.with_tax.value;
        } else {
            price_value = price.without_tax.value;
        }

        if (this.originalPrice > price_value) {
            priceDiff = parseFloat(this.originalPrice - price_value);
        } else {
            priceDiff = parseFloat(price_value - this.originalPrice);
        }

        let TableData = `<h2 class="productView-title-bulkPricing">Quantity Discounts</h2>
        <table class="productView-table-bulkPricing">
            <tbody>
                <tr>
                    <th>Quantity</th>`;

        bulk_discount_rates.forEach((bulk_discount_rate, i) => {
            TableData = TableData + `<td>` + bulk_discount_rate.min.toString() + (bulk_discount_rate.max > 1 ? ' - ' + bulk_discount_rate.max : ' +') + `</td>`;
        });

        TableData = TableData + `</tr><tr><th>Price each</th>`;

        bulk_discount_rates.forEach((bulk_discount_rate, i) => {
            TableData = TableData + `<td>`;

            if (bulk_discount_rate.type == 'percent') {
                TableData = TableData + this.moneyFormatterLocal((price_value / 100) * bulk_discount_rate.discount.value);
            }

            if (bulk_discount_rate.type == 'fixed') {
                TableData = TableData + this.moneyFormatterLocal(priceDiff + parseFloat(bulk_discount_rate.discount.formatted.toString().replace(/[^0-9\.]/g, "")));
            }

            if (bulk_discount_rate.type == 'price') {
                TableData = TableData + this.moneyFormatterLocal(price_value - bulk_discount_rate.discount.value);
            }

            TableData = TableData + `</td>`;
        });

        TableData = TableData + `</tr><tr><th>Savings</th>`;

        bulk_discount_rates.forEach((bulk_discount_rate, i) => {
            TableData = TableData + `<td>`;

            if (bulk_discount_rate.type == 'percent') {
                TableData = TableData + bulk_discount_rate.discount.value.toString() + '%';
            }

            if (bulk_discount_rate.type == 'fixed') {
                TableData = TableData + Math.ceil(100 - (100 * ((bulk_discount_rate.discount.value + priceDiff) / price_value))).toString() + '%';
            }

            if (bulk_discount_rate.type == 'price') {
                TableData = TableData + Math.ceil(100 - (((price_value - bulk_discount_rate.discount.value) / price_value) * 100)).toString() + '%';
            }

            TableData = TableData + `</td>`;
        });

        TableData = TableData + `</tr></tbody></table>`;

        return TableData;
    }

    /**
     * Custom Get as Low As Price
     * @author LimMedia.io
     * @param {*} price 
     * @param {*} bulk_discount_rates 
     * @returns 
     */
    getAsLowAs(price, bulk_discount_rates) {
        let priceDiff = 0;

        if (this.originalPrice > price.without_tax.value) {
            priceDiff = parseFloat(this.originalPrice - price.without_tax.value);
        } else {
            priceDiff = parseFloat(price.without_tax.value - this.originalPrice);
        }

        if (bulk_discount_rates.length == 0) {
            return 'As Low As ' + this.moneyFormatterLocal(priceDiff + price.without_tax.value);
        }

        let last = bulk_discount_rates[bulk_discount_rates.length - 1];

        if (last.type == 'percent') {
            return 'As Low As ' + this.moneyFormatterLocal(priceDiff + (price.without_tax.value - ((last.discount.value * price.without_tax.value) / 100)));
        }

        if (last.type == 'fixed') {
            return 'As Low As ' + this.moneyFormatterLocal(priceDiff + parseFloat(last.discount.formatted.toString().replace(/[^0-9\.]/g, "")));
        }

        if (last.type == 'price') {
            return 'As Low As ' + this.moneyFormatterLocal(priceDiff + (price.without_tax.value - last.discount.value));
        }

        return 'As Low As ' + this.moneyFormatterLocal(priceDiff + price.without_tax.value);
    }

    /**
     * Custom Money Formatter
     * @author LimMedia.io
     * @param {*} money 
     * @returns 
     */
    moneyFormatterLocal(money) {
        let formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });

        return formatter.format(money).toString();
    }
}
