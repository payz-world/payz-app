# Brand artwork sources

These assets identify the products' respective brands; ownership remains with
the trademark holders. Colors are not changed with CSS filters.

- Shell: https://wallpapers.com/images/hd/shell-logo-red-yellow-ylhb2f0hphp6ey09-2.png
  Background removed and resized; original red/yellow artwork retained.
- Dunkin Donuts: https://www.freepnglogos.com/uploads/dunkin-donuts-png-logo/company-the-official-dunkin-donuts-debuts-digital-png-logo-7.png
  Empty margins trimmed and white background made transparent.
- NTUC FairPrice: https://cdn.freebiesupply.com/logos/large/2x/fairprice-logo-png-transparent.png
  Transparent margins trimmed and resized.
- Google: https://raw.githubusercontent.com/gilbarbara/logos/main/logos/google-icon.svg
- Google Play: https://raw.githubusercontent.com/gilbarbara/logos/main/logos/google-play-icon.svg

Other supported symbols use the existing react-icons package. Brands without
available artwork show an unavailable-artwork indicator, never a fabricated
logo or a text wordmark.

## Additional authentic brand artwork

The domains in `src/brand-logo-domains.json` identify the brands' own websites.
Their actual website icons were downloaded from Google's favicon cache
(`https://www.google.com/s2/favicons?domain=DOMAIN&sz=128`), with DuckDuckGo's
website-icon cache as a download fallback. Assets are served locally; customer
browsing does not fetch logos from these services.

Higher-resolution original marks replace small website icons where available:

- Amazon Fresh: https://logotyp.us/file/amazon-fresh.svg
- Alfamart: https://images.seeklogo.com/logo-png/33/2/alfamart-logo-png_seeklogo-339891.png
- BP: https://upload.wikimedia.org/wikipedia/en/d/d2/BP_Helios_logo.svg
- LuLu: https://www.pngitem.com/pimgs/m/594-5942019_lulu-hypermarkets-malaysia-supermarket-list-logo-lulu-hypermarket.png
- Morrisons: https://freepngimg.com/download/graphic_design/87725-logo-text-commodity-supermarket-morrisons-free-transparent-image-hq.png
- Blibli: https://brandlogo.org/wp-content/uploads/2024/04/Blibli-Logo.png
- Dick's Sporting Goods: https://www.seekpng.com/png/full/263-2636145_dicks-sporting-goods-logo-transparent.png
- Jarir: https://companieslogo.com/img/orig/4190.SR_BIG-677644b0.png?t=1746288798
- Tim Hortons: https://cdn.freebiesupply.com/logos/large/2x/tim-hortons-3-logo-png-transparent.png
- Bigbasket: https://images.seeklogo.com/logo-png/61/3/bigbasket-logo-png_seeklogo-612610.png
- Foot Locker: https://images.seeklogo.com/logo-png/19/2/foot-locker-logo-png_seeklogo-197791.png
- Walmart: https://upload.wikimedia.org/wikipedia/commons/d/d3/Walmart_logo_(2008,_stacked).svg
- Best Buy: https://seekvectors.com/storage/images/8b45c721e58fd929b82ea4c8d8c3d871.svg

Only empty margins or backgrounds are removed when preparing these files.
Brand colors and the original artwork are retained. Search results with baked
checkerboards or unofficial redesigns are not used in the app.

## Sharp artwork overrides

`src/brand-high-resolution-assets.json` takes precedence over cached website
icons. Raster files in this registry come from original vectors or larger source
images, never an enlarged favicon. Original SVGs are retained in
`attached_assets/brand_logos/hd`. The ALDI Nord/Süd assets are separate crops of
their respective original marks, not a shared or invented logo.

- H&M: https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg
- Foot Locker: https://logotyp.us/file/foot-locker.svg
- ASOS: https://logotyp.us/file/asos.svg
- Fanatics: https://static.cdnlogo.com/logos/f/31/fanatics.svg
- 7-Eleven: https://static.cdnlogo.com/logos/7/73/7-eleven.svg
- AJIO: https://vectorseek.com/wp-content/uploads/2023/09/Ajio-Logo-Vector.svg-1-1.png
- ALDI Nord/Süd: https://upload.wikimedia.org/wikipedia/commons/8/8d/Aldi_Nord_und_Aldi_S%C3%BCd_logos.svg
- Almosafer: https://almosafer-corporate-website-assets-prod.almosafer.com/alm_logo1_44623c1b64.svg
- Amtrak: https://upload.wikimedia.org/wikipedia/commons/f/f2/Amtrak_logo_2.svg
- Arsenal: https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg
- Bigbasket: https://logotyp.us/file/bigbasket.svg
- Burger King: https://upload.wikimedia.org/wikipedia/commons/c/cc/Burger_King_2020.svg
- Decathlon: https://upload.wikimedia.org/wikipedia/commons/b/bc/Decathlon_-_logo_(France,_2024).svg
- Dunkin': https://logotyp.us/file/dunkin-donuts.svg
- Myer: https://seekvectors.com/storage/images/Myer%20Logo.svg
- Sephora: https://www.pngmart.com/files/23/Sephora-Logo-PNG-HD.png
- Sobeys: https://logotyp.us/file/sobeys.svg
- Subway: https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg
- Taco Bell: https://upload.wikimedia.org/wikipedia/en/b/b7/Taco_Bell_2023.svg
- Woolworths: https://upload.wikimedia.org/wikipedia/en/d/d4/Woolworths_Ltd._logo_%282022%29.svg

Blibli, Jarir, Tim Hortons, and Dick's Sporting Goods use larger preparations of
their original sources listed above. Marriott uses its genuine native vector
symbol from Simple Icons. Validated local artwork/native vectors take priority
over provider thumbnails so lower-resolution provider images cannot replace them.
