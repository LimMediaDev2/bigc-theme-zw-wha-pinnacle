/*
 * put productID on the element's "for" and "id" attrs so multiple cases of same option set won't conflict
 */
const makeOptionIdsUnique = (scope, productId, key) => {
    $('input[type="radio"], input[type="checkbox"]', scope).each((index, el) => {
        const optionId = $(el).attr('id'); // update ID to include product ID
        $(el).attr('id', `${key}_${optionId}_${productId}`); // update option ID to include product ID
        $(el).next().attr('for', `${key}_${optionId}_${productId}`); // update option label to target updated ID
    });
    // add input fields label class and put in here. These options we need to select their sibling label
    const optionsWithLabelAttrs = [
        'input[type="text"]',
        'input[type="number"]',
        'input[type="file"]',
        'select',
        'textarea',
    ]
    const optionsWithLabelAttrsSelectors = optionsWithLabelAttrs.join(',');
    $(optionsWithLabelAttrsSelectors, scope).parents('.form-field').find('label').each((index, el) => {
        const optionId = $(el).attr('for'); // update ID to include product ID
        $(el).attr('for', `${key}_${optionId}_${productId}`); // update option ID to include product ID
        $(el).next().attr('id', `${key}_${optionId}_${productId}`); // update option label to target updated ID
    });
}

export default makeOptionIdsUnique;
