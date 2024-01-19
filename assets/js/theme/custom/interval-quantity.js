import $ from 'jquery';
import swal from 'sweetalert2';

const VERSION = '1.1.0';

/**
 * IntuitSolutions.net - Interval Quantity
 * LimMedia.io
 */
export default class IntervalQuantity {
    constructor($scope, customOptions) {
        this.$scope = $scope;

        const defaultOptions = {
            customFieldName: 'interval quantity', // name of the custom field that will contain our interval number (must be exact spacing, capitalization, etc.) (if you change this, must update "cart/contemt.html")
            customFieldNameSelector: '.productView-info-name', // selwector of the Custom Field name
            quantityInput: '.form-input--incrementTotal', // quantity input
            quantityContainer: '.form-field--increments', // container where we prepend our message to customer
        };
        this.options = $.extend({}, defaultOptions, customOptions); // merge custom options into our default options

        this.interval = this.getInterval(); // get interval custom field's value
        this.bindEvents();
    }

    /**
     * get custom field value by matching the name's text
     */
    getInterval() {
        return Number($(`${this.options.customFieldNameSelector}:contains("${this.options.customFieldName}:")`, this.$scope).next().text()) || 1;
    }

    /**
     * hide custom field by matching text
     */
    hideCustomField() {
        $(`${this.options.customFieldNameSelector}:contains("${this.options.customFieldName}:")`, this.$scope).hide(); // hide cf name
        $(`${this.options.customFieldNameSelector}:contains("${this.options.customFieldName}:")`, this.$scope).next().hide(); // hide cf value
    }

    /**
     * returns true if an interval is set
     */
    hasInterval() {
        return this.interval !== 1;
    }

    /**
     * handle quantity changes
     */
    handleQuantityChange(event) {
        const $target = $(event.currentTarget);
        const $input = $(this.options.quantityInput, this.$scope);
        let quantityMin = parseInt($input.data('quantityMin'), 10);
        const quantityMax = parseInt($input.data('quantityMax'), 10);

        let qty = parseInt($input.val(), 10);

        // handles very first button click to get quantity in line with the interval
        if (qty === 1 && this.interval !== 1) {
            qty = 0;
        }

        // set min to interval so user can't go to 0
        if (quantityMin === 0 && this.hasInterval()) {
            quantityMin = this.interval;
        }

        // if user clicked a button, increment or decrement the qty
        if ($target.hasClass('button')) {
            qty = $target.data('action') === 'inc'
                ? qty + this.interval
                : qty - this.interval;
        }

        // check min/max qty
        if (qty < quantityMin) {
            $input.val(quantityMin); // apply correct quantity to the input
            return swal.fire({
                text: `The minimum purchasable quantity is ${quantityMin}`,
                icon: 'error',
            });
        } else if (qty > quantityMax && quantityMax !== 0) {
            $input.val(quantityMax); // apply correct quantity to the input
            return swal.fire({
                text: `The maximum purchasable quantity is ${quantityMax}`,
                icon: 'error',
            });
        }

        // check interval qty
        if ((qty % this.interval) !== 0) {
            qty = qty + (this.interval - (qty % this.interval)); // correct the quantity for the user
            $input.val(qty); // apply correct quantity to the input
            return swal.fire({
                text: `Please enter increments of ${this.interval}.`,
                icon: 'error',
            });
        }

        $input.val(qty); // apply quantity to the input
    }

    /**
     * bind events
     */
    bindEvents() {
        this.hideCustomField(); // hide the custom field

        $(this.options.quantityInput, this.$scope).on('change', event => this.handleQuantityChange(event)); // handle manually typing into qty box

        if (this.hasInterval()) {
            $(this.options.quantityContainer, this.$scope).prepend(`<p class="iq__message">This product is sold in increments of ${this.interval}</p>`); // append message for better UX
            if ($(this.options.quantityInput).data('quantity-min') === 0) {
                $(this.options.quantityInput, this.$scope).val(this.interval).change(); // update initial value to a valid increment
            }
        }
    }
}
