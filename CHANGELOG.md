# **Pinnacle Release Notes**

## September 8, 2021 Version 1.1.7
End of BigCommerce Fall Sale 2021
 * Updated pricing & meta images for each variation.
   * Updated Files:
     * config.json
     * package.lock.json
     * package.json
   
## August 30, 2021 Version 1.1.6
Announcing BigCommerce Fall Sale 2021
 * Updated pricing & meta images for each variation.
   * Updated Files:
     * config.json
     * package.lock.json
     * package.json
   * Added Directory & Files:
     * meta/sale

## June 4, 2021 - Version 1.1.5
  * CUSTOMER SUPPORT ITEMS:
    * Positioning correction of compare checkbox in grid-view when list-view is selected by defualt.
      * Updated Files:
        * assets/scss/pinnacle.scss

    * Positioning correction of small pagination on account pages. Has been relocated to the bottom of the page to be consistent with the rest of the theme and have corrected the alignment and overlap.
      * Updated Files:
        * templates/components/common/small-paginator.html
        * assets/scss/pinnacle.scss

    * We have developed a solution that should correct the width, alignment, and positioning of the action buttons on the product pages. We have made revisions so that they will both float correctly on desktop and then each will go full-width on mobile devices.
      * Updated Files:
        * assets/scss/pinnacle.scss

    * We have added additional spacing to the top of the product-listing-container on brand pages when list view is enabled by defualt, because of top line of products overlapping grid/list toggle buttons and sort bar.
      * Updated Files:
        * assets/scss/pinnacle.scss


## May 28, 2021 - Version 1.1.4
* CUSTOMER SUPPORT ITEMS:
  * If there is 1 or less items visible on product listing pages, then compare checkboxes and compare button will be hidden.
    * Updated Files:
      * templates/components/common/footer.html

  * Fix for font styles not updating within page builder text widget on content pages. Text widgets added to content pages will now adhere to widget font settings, including custom settings for: font-families, font-weights, font-sizes, font-colors and alignment.
    * Updated Files:
      * assets/scss/pinnacle.scss

  * Tool-tip spelling correction for “Including Tax”
    * Updated Files:
      * lang/en.json line#: 693.

  * Removal of excess space above hero slider in varying hero layouts.
    * Updated Files:
      * assets/scss/pinnacle.scss

  * Fix for Newsletter popup not loading after cookie is cleared or browser is closed when that setting is chosen.
    * Updated Files:
      * assets/js/theme/global/pinnacle/cookie-custom.js
      * assets/js/theme/global/pinnacle/pinnacle.js

  * Position fix for searchbar in sticky nav. Verified in both Windows and Mac for: ie11, edge, chrome, and firefox.
    * Updated Files:
      * assets/js/theme/global/pinnacle/pinnacle.js
      * assets/scss/pinnacle.scss

  * Color correction for cart icon in sticky nav.
    * Updated Files:
    * assets/scss/pinnacle.scss


## May 20, 2021 - Version 1.1.3
* BigCommerce Bug Report
  * THEME-2068: [Lonestar Templates] Saving vaulted credit cards in Account pages not working for some gateways – Revisions made according to GitHub reference: https://github.com/bigcommerce/cornerstone/commit/ba9eab1b00cbd6c10005239cdc5a1c76dc224341.
    * Replaced following Files with Cornerstone files version 5.2.0:
      * assets/js/theme/common/payment-method.js
      * templates/pages/account/add-payment-method.html
      * templates/pages/account/edit-payment-method.html

  * THEME-2001: Pinnacle – Page Builder Product Set Widget Does Not Display Properly. *Adding Products sets above and/or below the Hero Slider will render full-width and correctly on page load in both the page builder and live storefront. This was tested in both Chrome & Firefox.

  * [THEME-1815] Pinnacle – “Search suggest” still suggests regardless of setting being toggled off. *Toggling “Search Suggest” in control panel will now enable/disable search suggestions on search results page. Also the en.json file has been updated to correct the syntax.
    * Updated Files:
      * templates/pages/search.html
      * lang/en.json

  * [THEME-1986] Pinnacle – Unable to View Latest Blog Posts on Home Page If Blog does not have an Image Assigned. *News feed on home page will now show posts without uploaded images and display with a “coming soon” image. We have also added a theme editor option to hide all blog images within the feed on the home page.
    * Updated Files:
      * templates/components/custom/blog-feed.html
      * assets/scss/pinnacle.scss

  * [THEME-1985] Pinnacle – related products, featured product, and new products panels displays a duplicate products. *All product carousels will now not produce duplicate products. This was achieved by disabling infinite loop on all product carousels. This means that if there is only one product within a section or group such as “Featured”, only one product will display without duplicates. This also means that the slider will stop once it reaches the end of products. This affects featured, top, new, related, and similar products alike.
    * Updated Files:
      * templates/components/common/footer.html
      * templates/components/common/footer-product.html
      * assets/scss/pinnacle.scss

  * THEME-2079: wishlist-details.html does not support pagination. - Wishlists will now support pagination when more than 50 products are added to a single wishlist.
    * Upadated Files:
      * REPLACED with Cornerstone 5.4.0: assets/js/theme/wishlist.js
      * AMMENDED with Cornerstone 5.4.0: templates/components/account/wishlist-item-list.html
      * AMMENDED with Cornerstone 5.4.0: templates/components/common/paginator.html
      * AMMENDED with Cornerstone 5.4.0: templates/pages/account/wishlist-details.html

  * THEME-2084: [THEME-2084] Pinnacle 1.1.2 – carousel widgets are displaying incorrectly. - This appears to only be an issue directly beneath the built-in hero carousel.
    * This has been corrected by updating the following files:
      * templates/components/page/home-page-no-sidenav.html
      * templates/components/page/home-page-with-sidenav-float-carousel.html
      * templates/components/page/home-page-with-sidenav.html
      * assets/scss/pinnacle.scss

  * THEME-2011: Pinnacle – No error message and unable to add to cart if quantity selected is more than in stock amount. Modal Error message will now appear if more than available qty is added to cart and add to cart button is clicked.
    * Updated Files:
      * templates/components/common/body.html
      * assets/scss/pinnacle.scss

  * THEME-2084: [THEME-2077] Pinnacle 1.1.2 – product page thumbnails images not displaying initally. - This has been corrected. Thumbnails now display on load on product page.

  * Removed Geo Trust Seal Theme Editor Option and added various new Footer Global regions that will now be used to enter SSL seal badges and information. These new global footer regions can be used for a multitude of content as well. This was completed at the request of BigCommerce.
    * Upadated Files:
      * schema.json
      * config.json
      * templates/components/common/footer.html
      * templates/components/common/footer-product.html
      * assets/scss/pinnacle.scss

* CUSTOMER SUPPORT ITEMS:
  * Fix for varying font-families and font-weights for theme buttons. Added new theme editor option to adjust Product Card Button fonts found here: Products > Product Cards > Product Card Button Font.
    * Updated Files:
      * assets/scss/pinnacle.scss
      * assets/scss/optimized-checkout.scss
      * schema.json
      * config.json

  * Bulk Pricing Modal will now appear centered on the screen.
    * Updated Files:
      * assets/scss/pinnacle.scss

  * List View QuickView Button will now appear centered over product image in list view..
    * Updated Files:
      * assets/scss/pinnacle.scss

  * Fix for sidenav subcategory links that contain subcategories not clickable. Sidenav links with subcategories will now be clickable.
    * Updated Files:
      * assets/js/theme/global/pinnacle/custom.js

  * Adjustments made to newsletter popup that provide new theme editor settings. There are now 3 settings: 1.Popup Active (shows every time home page loads), 2.Popup Active (shows once on home page every 24 hours or when cookies are removed), 3.Popup Inactive. It’s worth mentioning that if selected, the cookie will now work and will only show once every 24 hours or when cookies are cleared/removed. This was the original intention but it has been displaying every time the home page loads. This issue has been resolved in this release and allows for store owners to choose the visibility behavior. In addition the popup will now appear centered within the screen.
    * Updated Files:
      * AMMENDED: assets/scss/pinnacle.scss
      * AMMENDED: schema.json
      * AMMENDED: templates/layout/home-layout.html
      * ADDED: assets/js/theme/global/pinnacle
      * ADDED: assets/js/theme/global/pinnacle/cookie-custom.js
      * ADDED: assets/js/theme/global/pinnacle/cookie-custom.js
      * AMMENDED: assets/js/theme/global.js

  * Style revisions made to correct header style issues on the checkout page. In addition, the mobile menu toggle button will now open/close the mobile menu.
    * Updated Files:
      * AMMENDED: assets/scss/pinnacle.scss
      * ADDED: templates/components/common/footer-checkout.html
      * AMMENDED: templates/layout/checkout.html
      * AMMENDED: templates/pages/checkout.html

  * Adjustments made to compensate for whether or not adminBar is active and visible. In addition body content will not jump when scrolling down and sticky nav slides down.
    * Updated Files:
      * assets/scss/pinnacle.scss
      * templates/components/common/footer.html
      * templates/components/common/footer-product.html

  * Fix for faceted search show more button not working when special characters or filter by ratings is listed first.
    * Updated Files:
      * replaced directory with Cornerstone 5.2.0: templates/components/faceted-search

  * Fix for: Arrow color within main and thumbnail images within quickview modal after clicking “quickview button” on a category or brand page, (base.html) file. Added body id to body element.
    * Updated Files:
      * templates/layout/base.html
      * templates/layout/checkout.html

  * Fix for: search bar within sticky nav top position was too high. This should now be centered within the sticky nav vertically.
    * Updated Files:
      * assets/scss/pinnacle.scss

  * Corrected issue of when a default option is out of stock, an add to cart button does not appear for in-stock options
    * Updated Files:
      * UPDATED WITH Cornerstone version 5.4.0: templates/components/products/add-to-cart.html
      * AMMENDED WITH Cornerstone version 5.4.0: assets/js/theme/common/product-details.js. All code was replaced with the exception of leaving “import _ from ‘lodash’;” intact. Also left the entire original section: showProductImage(image). This is necessary to maintain our custom zoom window and product option image swap.
      * AMMENDED WITH Cornerstone version 5.4.0: lang/en.json – beneath “Common”
      * AMMENDED: assets/scss/parts-warehouse.scss – beneath: // FIX FOR ADD TO CART BUTTON VISIBILITY WHEN DEFAULT OPTION IS UNAVAILABLE
      * AMMENEDED section class=”productView-details product-options” with Cornerstone version 5.4.0: templates/components/products/product-view.html
      * AMMENEDED section class=”productView-details product-options” with Cornerstone version 5.4.0:templates/components/products/product-quick-view.html
      * ADDED FROM Cornerstone version 5.4.0: assets/js/theme/common/aria
      * ADDED FROM Cornerstone version 5.4.0: assets/js/theme/common/utils
      * ADDED FROM Cornerstone version 5.4.0: assets/js/theme/common/product-details-base.js

  * Corrected issue when default option is set to an option rule image, and then clicking back to an option without an image rule, the main-image container does not update to the default image in the control panel. Clicking an option without a rule image will now display the first image listed under said product in the control panel, just as Cornerstone does.
    * Updated Files:
      * assets/js/theme/global/loading-progress-bar.js
      *templates/components/common/footer-product.html


## February 19, 2021 Version 1.1.2
* BIGCOMMERCE BUG REPORT ITEMS:
  * [THEME-2056] Pinnacle 1.1.1 – Variant Bulk Pricing Does not Display Properly on PDP: Bulk Pricing within modal on product page will now dynamically adjust when options are selected on the frontend that have varying price list bulk pricing set up in the control panel.
    * Updated Files:
      * updated: templates/components/products/product-view.html
      * added file: assets/js/theme/common/product-details-base.js
      * updated: assets/scss/pinnacle.scss
      * replaced directory with Cornerstone 5.1.0: templates/components/cart/modals
      * replaced file with Cornerston 5.1.0: templates/components/cart/item-options.html
      * added directory from Cornerstone 5.1.0:: assets/js/theme/common/utils
      * added directory from Cornerstone 5.1.0: templates/components/common/alert
      * added directory from Cornerstone 5.1.0: templates/components/common/modal
      * added file from Cornerstone 5.1.0: templates/components/common/requireness-msg.html
      * added file from Cornerstone 5.1.0: templates/components/products/product-aria-label.html

* CUSTOMER SUPPORT ITEMS:
  * Fix for: Blog images on single post page within the body stretching to 100%. Those images will now be auto width and not distort.
    * Updated Files:
      * assets/scss/pinnacle.scss
  * Fix for: not being able to click first thumbnail when a default product option is set to show on load.
  * Fix for: setting fancybox image on load to the default option image if set. Main image was setting to default variant image, but when clicked, fancybox was loading the main default image instead of the variant image. This has been corrected.
    * Updated Files:
      * templates/components/common/footer-product.html


## February 5, 2021 Version 1.1.1
* BigCommerce Bug Report
  * THEME-2039: Pinnacle – Lonestar Templates – Theme Vertical Reassignments Completed. Industries have been adjusted according to the recommendations provided by BigCommerce as follows:
    * Euro – “automotive_industrial”, “electronics_computers”
    * Impact – “automotive_industrial”, “electronics_computers”, “home_garden”
    * Sport – “automotive_industrial”, “electronics_computers”, “sports_recreation”
    * Tech – “automotive_industrial”, “electronics_computers”

    * "optimized_for” also updated on all variations to:
      * “multi_purpose”
      * “mobile_tablet_desktop”
      * “sales_discounts”
      * “large_catalog”

    * Updated Files:
      * config.json

* CUSTOMER SUPPORT ITEMS:
  * Fix for font sizes & colors not adjusting within page builder widgets on content pages.
    * Updated Files:
      * assets/scss/pinnacle.scss

  * Fix wishlist button on product page jumping on click.
    * Updated Files:
      * assets/scss/pinnacle.scss

  * Theme Editor option added for adjustments to Footer header font-families.
    * Updated Files:
      * schema.json


## October 27, 2020 Version 1.1.0
* NEW FEATURES:
  * Global Page Builder Elements Added Throughout Theme! Using the global regions in the header & footer areas will be visible throughout your site. Adding content to the global regions within the product, category, brand, or content pages will add that content to the respective pages throughout your site. That is, if you add content to a Global Widget on a product page, that content will be visible within that area on ALL product pages, etc…
    * Updated Files:
      * templates/components/common/header.html
      * templates/components/common/footer-product.html
      * templates/components/common/footer.html
      * templates/components/page/content-page-no-sidenav.html
      * templates/components/page/content-page-with-sidenav.html
      * templates/components/products/product-quick-view.html
      * templates/components/products/product-view.html
      * templates/pages/brand.html
      * templates/pages/category.html
      * templates/pages/product.html
      * templates/pages/page.html
      * assets/scss/pinnacle.scss

  * Added Persistent Admin Bar when logged in.

  * Updated all sprite references to use latest Cornerstone functionality. Removed StumbleUpon svg, generating unnecessary code in the DOM.

  * Added Files:
      * all required files to generate persistent admin bar, when logged in including, js, scss, schema, and config
  * Updated Files:
      * templates/layout/base.html
      * templates/layout/home-layout.html
      * templates/layout/product-new.html
      * templates/layout/product.html


## July 17, 2020 Version 1.0.8/1.0.9 - 1.0.8 had bundling issues
* BIGCOMMERCE BUG REPORT ITEMS:
  * THEME-1981 – Pinnacle theme – Lonestar Templates – Update jQuery in Theme. jQuery version updated to 3.5.1
    * Updated Files:
      * templates/components/common/footer-product.html
      * templates/components/common/footer.html
      * All root-level files updated with latest Cornerstone version 4.7.0, including package.json, package-lock.json, babel.config.js, Gemfile, Gemfile.lock, jest-eventemitter2-transformer.js, jest.config.js, jest.setup.js, lighthouse-config.js, schemaTranslations.json, stencil.conf.js, webpack.common.js, webpack.sev.js, webpack.prod.js
      * All amp files replaced with latest Cornerstone version 4.7.0
      * Complete js directory replaced with latest Cornerstone version 4.7.0

* CUSTOMER SUPPORT ITEMS:
  * Fix for thumbnail images not all displaying on the product page.
  * Fix for z-index of bulk pricing modal on product page
  * Fix for image swap rules in quick-view. When there was no image swap rules, selecting an option would attempt to load a new image and was breaking the image link.


* NEW FEATURES & DESIGN IMPROVEMENTS:
  * Theme editor option for displaying thumbnail images beneath main image on product page in grid (no carousel), or with carousel. Found here: Product Page > Enable product thumbnail carousel.
  * Theme editor option for global arrow color controls for both background and arrow colors. This setting will impact Hero Carousel arrows, Main product image arrows on product page, thumbnail carousel arrows, and Fancybox arrows. Setting Found here: Global > Arrow color & Arrow background color. In addtion arrows will now be visible when hovering over the main product page image or thumbnails. Disabled arrows are dimmed and pointer-events have been disabled when beginning or ending images are reached.
  * Active thumbnail beneath main product image on product page, will have a light border around it to help illustrate it is active.
  * Main product images will now be centered both vertically and horizontally for images with varying heights.
  * Thumbnail carousel images will be centered beneath the main product image.
  * Addtional Page Builder widgets added to product page and content page.
  * Fancybox zoom will now work in quickview just as it does on the product page.
  * Fancybox zoom will now work on mobile.
  * Fancybox options on mobile for users to hide/show arrows.

* DEPRECATED FEATURES
  * Instagram Feed Removal
    * We have removed the Instagram settings from the schema.json file. As of June 29, 2020 the API that was used to create this feature was disabled by Facebook/Instagram. We have found a nice alternative that is fairly simple to set up: https://www.bigcommerce.com/apps/elfsight-instagram-feed/. This can easily be styled & setup one the app has been installed within your store’s control panel. There is a free version that can be self-installed, and paid version have support and free set up.


## June 22, 2020 Version 1.0.7
* CUSTOMER SUPPORT ITEMS:
  * Fix for arrow alignment of Showcase Products on Homepage when using “No Tabs, In Carousels” Theme Editor setting.
Updated Files:
assets/scss/pinnacle.scss
Removed duplicate “Sitemap” link from “Accounts & Orders” column within the footer. There is a “Sitemap” link within the copyright section at the bottom of the footer.
    * Updated Files:
      * templates/components/common/footer.html

  * Special Characters such as ampersands, quotes, and apostrophes will render as intended and not as HTML within the compare table product cards.
    * Updated Files:
      * templates/pages/compare.html. Replaced all instances of {{summary}} with {{{ sanitize summary }}}. Also added style rule to include line entered line breaks. .compare-page .card-text .normal-text {
        white-space: pre-line;
      }
      * assets/scss/pinnacle.scss
  * Fix for Search Results Server Error
    * Updated Files:
      * templates/components/custom/search-results-sidenav.html

  * Coming Soon Image is now working on product page when no image has been uploaded.
    * Updated Files:
      * templates/components/products/product-view.html

  * 2nd Hover image functionality corrected when active and there is no 2nd hover image.
    * Updated Files:
      * templates/components/products/card.html
      * assets/scss/pinnacle.scss

  * Height Adjustment for Product Title line settings on cards.
    * Updated Files:
      * assets/scss/pinnacle.scss

  * Alt text for Review Image added
  * Updated Files:
    * templates/components/products/modals/writeReview.html


## June 16, 2020 Version 1.0.6
* NEW FEATURES:
  * Page Builder Functionality Added.
    * Updated Files:
      * templates/components/page/home-page-no-sidenav.html
      * templates/components/page/home-page-with-sidenav-float-carousel.html
      * templates/components/page/home-page-with-sidenav.html
      * templates/components/pages/brand.html
      * templates/components/pages/brands.html
      * templates/components/pages/category.html
      * templates/components/pages/product.html
      * templates/components/products/product-view.html
      * templates/components/pages/search.html

  * Price Range checkbox added to Theme Editor found here: Products > Product Prices
    * Updated Files:
      * config.json
      * schema.json
      * templates/components/products/price.html
      * templates/components/products/price-range.html
      * assets/scss/pinnacle.scss

  * Pricing Labels options added to Theme Editor for product page only, for now. Coming soon on product cards as well.
    * Updated Files:
      * config.json
      * schema.json
      * templates/components/products/price.html
      * templates/components/products/price-range.html
      * assets/scss/pinnacle.scss

  * Added Theme Editor settings for number of lines allowed for product titles on product cards, found here: Products > Card Title > Limit Card Title Number of Lines
    * Updated Files:
      * config.json
      * schema.json
      * templates/components/products/card.html
      * assets/scss/pinnacle.scss

  * Added Theme Editor settings for font-size of product titles on product cards, found here: Products > Card Title > Card Title Font size
    * Updated Files:
      * config.json
      * schema.json
      * templates/components/products/card.html
      * assets/scss/pinnacle.scss

* DESIGN REVISIONS:
  * Centered product thumbnails in carousel beneath main image on product page.

* CUSTOMER SUPPORT ITEMS:
  * FIX for Duplicate Sidenav Banners
    * Updated Files:
      * templates/components/category/sidebar.html
      * templates/components/brand/sidebar.html
      * templates/components/search/sidebar.html
      * templates/components/custom/category-sidenav.html
      * templates/components/custom/brand-sidenav.html
      * templates/components/custom/search-results-sidenav.html
      * templates/components/custom/sidenav.html

  * QuickSearch layout re-styled to bring buttons back into view.

  * Special Characters in Reviews will now render correctly.

  * Product options containing special characters such as ampersands and quotes should render as entered on cart page and cart preview modal. This was corrected by using triple braces instead of double for everywhere the {{value}} expression appears in the templates/cart/content.html and templates/cart/preview.html files.

  * Special Characters – faceted Search. Fixed using: https://github.com/bigcommerce/cornerstone/commit/a19e13eacffa53deef2a4bce80528dc38dc6652e.
    * Files edited replacing {{ title }} with {{{ sanitize title }}}
      * templates/components/faceted-search/facets/hierarchy-children.html
      * templates/components/faceted-search/facets/hierarchy-children.html
      * templates/components/faceted-search/facets/multi.html
      * templates/components/faceted-search/selected-facets.html

  * Fix for Compare button visibility when disabled/enabled
    * Updated Files:
      * templates/components/products/card.html
      * templates/components/products/list-item.html

  * Fix for products.you_save_opening_text, products.you_save_closing_bracket – on product page after options are selected.
    * Updated Files:
      * lang/en.json

  * Style fix for: Main product image not full-width at 800px & below when sidenav is active on product page.
    * Updated Files:
      * assets/scss/pinnacle.scss

  * Fix for styling of Stripe checkbox “vaulting” (saving credit card for future transactions).
    * Updated Files:
      * assets/scss/optimized-checkout.scss

* BIGCOMMERCE BUG REPORT ITEMS:
  * FIX FOR: THEME-1877 – Pinnacle theme – coupon box misaligned and out of proportion when screen width less than 1200px: GC field/button alignment are now fully repsonive.
    * Updated Files:
      * assets/scss/optimized-checkout.scss

  * FIX FOR: THEME-1924 Pinnacle 1.0.5 – Product Page > Add to Cart Button Hover Text Color not reflected: The hover text color in buttons on product page will now be impacted by adjusting using the Theme Editor found here: Product Page > Add to Cart Button Hover Text Color.
    * Updated Files:
      * config.json
      * schema.json
      * assets/scss/pinnacle.scss

  * FIX FOR: THEME-1856 – Pinnacle 1.0.4 – Checkout country/state selector styling hides text
    * Updated Files:
      * assets/scss/optimized-checkout.scss
