import $ from 'jquery';
import utils from '@bigcommerce/stencil-utils';
import makeOptionIdsUnique from './make-options-unique';
import _ from 'lodash';
import swal from 'sweetalert2';

export default class CartPageUpsellProduct {
    constructor($scope) {
        this.$scope = $scope;

        this.$scope.addClass('hasOptions--wired');

        this.initRadioAttributes();

        this.$form = $('form', this.$scope);
        this.$productId = $('[name="product_id"]', this.$form).val();

        this.key = 'cpu'; // unique indentifier for this customization

        this.$productOptionsElement = $(`[data-${this.key}-option-change]`, this.$form); // ie <div class="options" data-cpu-option-change>

        this.updateOptionView();
        // utils.api.productAttributes.optionChange(this.$productId, this.$form.serialize(), (err, response) => {
        //     const attributesData = response.data || {};
        //     const attributesContent = response.content || {};
        //     this.updateProductAttributes(attributesData);
        //     // if (hasDefaultOptions) {
        //         this.updateView(attributesData, attributesContent);
        //     // } else {
        //     //     this.updateDefaultAttributesForOOS(attributesData);
        //     // }
        // });


        this.bindEvents();
    }

    /**
     * add "isRequired" to options that are required
     */
    addRequiredClasstoOptions() {
        $('.form-field', this.$productOptionsElement).toArray().forEach(option => {
            if ($(option).find('small:contains("Required")').length) {
                $(option).addClass('isRequired');
            }
        });
    }

    /**
     * Handle product options changes
     */
    productOptionsChanged(event) {
        const $changedOption = $(event.target);
        const optionRow = $(event.target).parents('.form-field');

        // Do not trigger an ajax request if it's a file or if the browser doesn't support FormData
        if ($changedOption.attr('type') === 'file' || window.FormData === undefined) {
            // do nothing
        } else {
            this.updateOptionView();
        }

        // was an option with a value selected?
        if ($changedOption.val() !== '') {
            if ($changedOption.is('input')) {
                const type = $changedOption.attr('type');
                switch (type) {
                    case 'radio':
                        $changedOption.attr('checked', true);
                        $changedOption.siblings('input').attr('checked', false);
                        optionRow.addClass('isSelected');
                        break;
                    case 'checkbox':
                        if ($changedOption.prop('checked')) {
                            optionRow.addClass('isSelected')
                            $changedOption.attr('checked', true);
                        } else {
                            optionRow.removeClass('isSelected');
                            $changedOption.attr('checked', false);
                        }
                        break;
                    case 'text':
                    case 'number':
                        $changedOption.val().length !== 0
                            ? optionRow.addClass('isSelected')
                            : optionRow.removeClass('isSelected');
                        $changedOption.attr('value', $changedOption.val());
                        break;
                }
            } else if ($changedOption.is('select')) {
                const $selectedOption = $changedOption.find(`option[value="${$changedOption.val()}"]`);
                $selectedOption.attr('selected', true);
                $selectedOption.siblings('option').attr('selected', false);
                // if it's a date select, make sure all 3 selects are filled in before saying it's filled in
                if (
                    $changedOption.attr('name').indexOf('month') !== -1 ||
                    $changedOption.attr('name').indexOf('day') !== -1 ||
                    $changedOption.attr('name').indexOf('year') !== -1
                ) {
                    // count the other date fields (if changed month, see if day and year are filled out)
                    const otherSelectedDateFields = $changedOption.siblings('select').toArray().reduce((count, select) => {
                        return $(select).val() === ''
                            ? count
                            : count + 1;
                    }, 0);
                    // if all fields are filled in
                    if (otherSelectedDateFields === 2) {
                        optionRow.addClass('isSelected');
                    }
                } else {
                    optionRow.addClass('isSelected'); // it's not a date select, just mark the option as selected
                }
            } else if ($changedOption.is('textarea')) {
                $changedOption.val().length !== 0
                    ? optionRow.addClass('isSelected')
                    : optionRow.removeClass('isSelected');
                $changedOption.text($changedOption.val());
            }
        } else {
            // else remove class (there was no value for this option)
            optionRow.removeClass('isSelected');
        }

        this.checkOptionsSelected();
    }

    /**
     *  Make API call on option change to update availability
     */
    updateOptionView()  {
        utils.api.productAttributes.optionChange(this.$productId, this.$form.serialize(), (err, response) => {
            const productAttributesData = response.data || {};
            this.updateProductAttributes(productAttributesData);
            this.updateView(productAttributesData);
            // stock stuff (should wire up image change as well later)
            // if (productAttributesData.stock !== undefined) {
            //     $('.currentStock', $scope).text(productAttributesData.stock);
            // } else {
            //     $('.currentStock', $scope).text('');
            // }
        });
    }

    /**
     *  Check whether all required options are selected 
     */
    checkOptionsSelected()  {
        /*
        ## see if all options are selected
        */
        const numberRequiredOptions = this.$scope.find('.form-field.isRequired').length;
        const numberSelectedOptions = this.$scope.find('.form-field.isRequired.isSelected').length;
        // const $addToCartButton = $form.find('.card-actions .button');
        // $addToCartButton.removeClass('button--success');
        if (numberRequiredOptions === 0 || numberRequiredOptions <= numberSelectedOptions) {
            this.$scope.addClass('hasOptions--selected'); // add class to product for easy adding to cart
            $('.cpu__modal').addClass('hasOptions--selected'); // update text for user as well
        } else {
            this.$scope.removeClass('hasOptions--selected'); // remove class since not all options filled in
            $('.cpu__modal').removeClass('hasOptions--selected'); // update text for user as well
        }

    }

    /**
     * Update the view of price, messages, SKU and stock options when a product option changes
     * @param  {Object} data Product attribute data
     *
     */
    updatePriceView(price) {
        if (price.without_tax) {
            $(`[data-product-price-without-tax]`, this.$scope).html(price.without_tax.formatted);
        }
    }

    /**
     * Update the view of price, messages, SKU and stock options when a product option changes
     * @param  {Object} data Product attribute data
     */
    updateView(data) {
        // update price
        // const viewModel = this.getViewModel(this.$scope);
        if (_.isObject(data.price)) {
            this.updatePriceView(data.price);
        }
        // update image
        const imageEl = $(`.cpu__item-img`, this.$scope);
        if (_.isObject(data.image)) {
            const imageSrc = data.image.data.replace('{:size}', '300x300');
            imageEl.attr('src', imageSrc);
        } else {
            imageEl.attr('src', imageEl.data('src'));
        }
        // update message if there is one
        const optionMessage = data.stock_message || data.purchasing_message;
        if (optionMessage !== null) {
            swal.fire({
                text: optionMessage,
                icon: 'error',
            });
            this.$scope.addClass('hasOptions--error');
        } else {
            this.$scope.removeClass('hasOptions--error');
        }
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

        $('[data-product-attribute-value]', this.$scope.add('.cpu__modal')).each((i, attribute) => {
            const $attribute = $(attribute);
            const attrId = parseInt($attribute.data('product-attribute-value'), 10);

            if (inStockIds.indexOf(attrId) !== -1) {
                this.enableAttribute($attribute, behavior, outOfStockMessage);
            } else {
                this.disableAttribute($attribute, behavior, outOfStockMessage);
            }
        });
    }

    disableAttribute($attribute, behavior, outOfStockMessage) {
        if (this.getAttributeType($attribute) === 'set-select') {
            return this.disableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
        }
        if (behavior === 'hide_option') {
            $attribute.hide();
        } else {
            $attribute
                .addClass('unavailable')
                .prev('input')
                .attr('disabled', true);
        }
    }

    disableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
        const $select = $attribute.parent();

        if (behavior === 'hide_option') {
            $attribute.toggleOption(false);
            // If the attribute is the selected option in a select dropdown, select the first option (MERC-639)
            if ($attribute.parent().val() === $attribute.attr('value')) {
                $select[0].selectedIndex = 0;
            }
        } else {
            $attribute.attr('disabled', 'disabled');
            $attribute.html($attribute.html().replace(outOfStockMessage, '') + outOfStockMessage);
        }
    }

    enableAttribute($attribute, behavior, outOfStockMessage) {
        if (this.getAttributeType($attribute) === 'set-select') {
            return this.enableSelectOptionAttribute($attribute, behavior, outOfStockMessage);
        }

        if (behavior === 'hide_option') {
            $attribute.show();
        } else {
            $attribute
                .removeClass('unavailable')
                .prev('input')
                .attr('disabled', false);
        }
    }

    enableSelectOptionAttribute($attribute, behavior, outOfStockMessage) {
        if (behavior === 'hide_option') {
            $attribute.toggleOption(true);
        } else {
            $attribute.removeAttr('disabled');
            $attribute.html($attribute.html().replace(outOfStockMessage, ''));
        }
    }

    getAttributeType($attribute) {
        const $parent = $attribute.closest('[data-product-attribute]');
        return $parent ? $parent.data('product-attribute') : null;
    }

    /**
     * Allow radio buttons to get deselected
     */
    initRadioAttributes() {
        $('[data-product-attribute] input[type="radio"]', this.$scope).each((i, radio) => {
            const $radio = $(radio);

            // Only bind to click once
            if ($radio.attr('data-state') !== undefined) {
                $radio.click(() => {
                    if ($radio.data('state') === true) {
                        $radio.prop('checked', false);
                        $radio.data('state', false);

                        $radio.change();
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
     * bind events
     */
    bindEvents() {
        makeOptionIdsUnique(this.$scope, this.$productId, this.key); // make options unique so there aer no conflicts when selecting options

        this.addRequiredClasstoOptions(); // add "isRequired" to required options
        this.checkOptionsSelected();

        // listen for option changes
        this.$productOptionsElement.change(event => {
            this.productOptionsChanged(event, event.target);
        });
        this.$productOptionsElement.show();

        // update options selected on load
        this.$productOptionsElement.find('input[type="checkbox"]').trigger('change'); // trigger selected checkbox options to update starting checkbox values
        this.$productOptionsElement.find('input[type="radio"]:checked').trigger('change'); // trigger selected radio options to update starting radio buttons values
        this.$productOptionsElement.find('input[type="text"]').trigger('change'); // trigger update on input text to catch any default values
        this.$productOptionsElement.find('input[type="number"]').trigger('change'); // trigger update on input numbers to catch any default values
        this.$productOptionsElement.find('textarea').trigger('change'); // trigger update on textarea tp catch any default values
        this.$productOptionsElement.find('option:selected').parent().trigger('change'); // trigger selected options to update starting select box values
    }
}
