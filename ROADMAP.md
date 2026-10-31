# MST Bazar Roadmap

Each item is ticked when it is done. Steps run one at a time, on approval.

## Roles

- Moderator: manages everything, including finance.
- Admin: same access as a moderator, and is the only role that can create moderators.

## Decisions

- Income is money actually received. COD is recorded when an order is marked Delivered. bKash/Nagad is recorded with "Mark as paid" after checking the TrxID.
- Total due shows both: money customers owe, and money owed to suppliers.
- Checkout requires a phone number. Email is optional.
- Checkout item checkboxes are removed.
- Item prices are rounded to the nearest whole taka, per unit, everywhere.
- Promo discounts apply to items only, not delivery, and round down to a whole taka.
- A promo use is any linked order that is not Cancelled. Returned orders keep their use.
- Customers are matched for per-customer limits by phone number and account.
- Expenses count the full bill on its date. Any unpaid part also shows as owed to the supplier.
- Customer due includes every open order, so COD orders count until they are delivered.
- Returning or undoing a delivered COD order removes its automatic payment. Payments recorded by hand stay until someone deletes them, so a refund must be removed by hand.

## Step 1: Critical fixes

- [x] Add a role check to `updateOrderSummary`
- [x] Stop Meta tracking or email failures from failing a saved order
- [x] Add auth checks to the analytics actions
- [x] Remove `productCost` from the public Track Order result
- [x] Block unavailable products in `placeOrder`
- [x] Add auth checks to the 3 admin pages that query the database directly
- [x] Add rate limits to order placement and Track Order
- [x] Protect `/api/capi` and rename the Meta token env variable (update it on deploy)

## Step 2: Favicon and brand icons

- [x] Redraw the logo as a small, clean SVG with a larger "m"
- [x] Simplify the leaves for 16-32px sizes
- [x] Generate `favicon.ico`, SVG, Apple icon and app icons
- [x] Update the manifest and `theme_color`
- [x] Update the admin sidebar icon
- [x] Delete the oversized icon files

## Step 3: Correct data and shared pricing

- [x] Create one price calculation for cart, checkout, server, emails and admin
- [x] Fix order totals in the admin list and dashboard
- [x] Fix admin order search and the payment column
- [x] Fix the contacts month filter
- [x] Give moderators full access to all admin pages, including Products
- [x] Limit creating moderators and changing roles to Admin
- [x] Remove "Edugen Global" from the Analytics title
- [x] Fix the `revalidatePath` routes
- [x] Flag TrxIDs used on more than one order
- [x] Fix the order email HTML and escape customer text
- [x] Fix the guest cart merge for deleted products
- [x] Show the featured image in the cart
- [x] Match Track Order phone formats
- [x] Enforce the quantity limit on the Product page
- [x] Return customers to checkout after login
- [x] Show "Out of stock" on the storefront
- [x] Use Dhaka time for all date filters
- [x] Send discounted prices to Meta tracking

## Step 4: Safe database setup

- [x] Compare the live database with `schema.prisma`
- [ ] Baseline the migrations without losing data
- [x] Add a deploy process for migrations

## Step 5: Promo codes

- [ ] Add the promo code tables
- [x] Build the admin page: create, edit, pause, delete, usage counts
- [x] Support percent or fixed discounts, maximum discount and minimum order
- [x] Support start and end dates, total limit and per-customer limit
- [x] Validate codes on the server when an order is placed
- [x] Prevent two customers taking the last use
- [x] Return a use when an order is cancelled
- [x] Show the code in checkout, emails, tracking, dashboard and admin orders

## Step 6: Checkout redesign

- [x] Add a simple header and remove the footer, navigation and WhatsApp button
- [x] Build the one-column mobile layout with a collapsible summary
- [x] Add a fixed bottom bar with the total and Place Order
- [x] Remove the item checkboxes
- [ ] Make email optional
- [x] Accept Bangla digits and `+880` numbers
- [x] Show clear errors that scroll to the problem field
- [x] Show the exact amount with a copy button in the bKash/Nagad panel
- [x] Add the promo code field
- [x] Add a "Sign in" link that returns to checkout
- [x] Replace the success popup with an order success page
- [x] Fix the empty cart flash on refresh
- [x] Correct the "won't be charged" text

## Step 7: Finance page

- [ ] Add the expense table
- [x] Build `/admin/finance`, open to moderators and admins
- [x] Add, edit, delete and search expenses
- [x] Add categories: Product Purchase, Transport, Packaging, Marketing, Salary, Rent, Other
- [x] Add supplier due tracking
- [x] Show income, expenses, net profit and total due cards
- [x] Filter by this month, last month, chosen month, year or custom dates
- [x] Add the monthly chart and category breakdown
- [x] Add the list of unpaid orders
- [x] Split the page into Overview, Expenses, Customer Dues and Supplier Dues tabs, with a monthly table on Overview
- [ ] Record who saved each expense (code done, migration `20261101140000_add_expense_created_by` not applied)
- [x] Create payment records automatically
- [x] Add "Mark as paid"
- [x] Remove the per-order "Cost & Revenue" card and cost form
- [x] Confirm what happens to the old cost data before removing the columns (dropped, not moved to expenses)

## Step 8: Professional admin panel

- [x] Reorganize the menu: Overview, Sales, Catalog, Finance, People
- [x] Fix sidebar icons and active highlighting
- [x] Rebuild the dashboard with sales, pending orders, due amounts and a chart
- [x] Add quick status changes and "Mark as paid" to the order list
- [x] Make tables, empty states and loading states consistent
- [x] Improve mobile layouts

## Step 9: SEO, performance and tooling

- [x] Add Product and Breadcrumb schema
- [x] Fix the social share images
- [x] Replace "MST Shop" and `en_US`
- [x] Use one domain everywhere
- [x] Fix `robots.ts`
- [x] Repair the 404 page links
- [x] Stop sending the whole catalog to every page
- [x] Compress large images
- [x] Fix ESLint
- [x] Add `nanoid` as a direct dependency
- [x] Add tests for pricing and promo codes
