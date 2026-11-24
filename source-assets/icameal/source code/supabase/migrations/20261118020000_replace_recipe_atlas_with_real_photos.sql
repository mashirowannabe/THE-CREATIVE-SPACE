-- Replace the temporary recipe atlas with real third-party food photographs.
-- Attribution, license and original source page are stored with each recipe.
-- This migration is idempotent and is applied after the recipe-catalog seed migration.

begin;
update public.recipes
set cover_image_url='https://upload.wikimedia.org/wikipedia/commons/b/bd/Ayam_Kecap_1.jpg',
    image_tile=null,
    image_source_url='https://commons.wikimedia.org/wiki/File:Ayam_Kecap_1.jpg',
    image_credit='Tamba Budiarsana — Pexels Free License'
where slug='ayam-kecap';
update public.recipes
set cover_image_url='https://images.pexels.com/photos/37106989/pexels-photo-37106989.jpeg?auto=compress&cs=tinysrgb&w=1200',
    image_tile=null,
    image_source_url='https://www.pexels.com/photo/authentic-indonesian-sayur-lodeh-in-bali-37106989/',
    image_credit='Gunawan Kartapranata — CC BY-SA 4.0'
where slug='sayur-lodeh';
update public.recipes
set cover_image_url='https://upload.wikimedia.org/wikipedia/commons/b/b3/Perkedel_kentang_tanpa_daging.JPG',
    image_tile=null,
    image_source_url='https://commons.wikimedia.org/wiki/File:Perkedel_kentang_tanpa_daging.JPG',
    image_credit='Midori — CC BY 3.0 (also offered under GFDL 1.2+)'
where slug='perkedel-kentang';
update public.recipes
set cover_image_url='https://images.pexels.com/photos/31336122/pexels-photo-31336122.jpeg?auto=compress&cs=tinysrgb&w=1200',
    image_tile=null,
    image_source_url='https://www.pexels.com/photo/indonesian-fried-fish-with-spicy-sambal-sauce-31336122/',
    image_credit='Dovinda Rd — Pexels Free License'
where slug='ikan-kembung-balado';
update public.recipes
set cover_image_url='https://images.pexels.com/photos/38837082/pexels-photo-38837082.jpeg?auto=compress&cs=tinysrgb&w=1200',
    image_tile=null,
    image_source_url='https://www.pexels.com/photo/spicy-stir-fried-vegetables-and-scrambled-eggs-38837082/',
    image_credit='Shaiful Ismail — Pexels Free License'
where slug='oseng-buncis-wortel-telur';
update public.recipes
set cover_image_url='https://images.pexels.com/photos/15797948/pexels-photo-15797948.jpeg?auto=compress&cs=tinysrgb&w=1200',
    image_tile=null,
    image_source_url='https://www.pexels.com/photo/thai-street-food-stir-fried-vermicelli-with-egg-and-vegetables-on-a-white-background-15797948/',
    image_credit='Eaksit Sangdee — Pexels Free License'
where slug='bihun-goreng-sayur';
update public.recipes
set cover_image_url='https://images.pexels.com/photos/29538427/pexels-photo-29538427.jpeg?auto=compress&cs=tinysrgb&w=1200',
    image_tile=null,
    image_source_url='https://www.pexels.com/photo/delicious-chicken-corn-soup-in-white-bowl-29538427/',
    image_credit='Nano Erdozain — Pexels Free License'
where slug='sup-jagung-telur';
update public.recipes
set cover_image_url='https://upload.wikimedia.org/wikipedia/commons/6/6f/Nasi_Bakar_Ayam.JPG',
    image_tile=null,
    image_source_url='https://commons.wikimedia.org/wiki/File:Nasi_Bakar_Ayam.JPG',
    image_credit='Gunawan Kartapranata — CC BY-SA 3.0'
where slug='nasi-bakar-ayam-suwir';
update public.recipes
set cover_image_url='https://upload.wikimedia.org/wikipedia/commons/b/b7/Tahu_telur.jpg',
    image_tile=null,
    image_source_url='https://commons.wikimedia.org/wiki/File:Tahu_telur.jpg',
    image_credit='Shinta amalia — CC BY-SA 4.0'
where slug='tahu-telur-saus-kacang';
update public.recipes
set cover_image_url='https://images.pexels.com/photos/32909265/pexels-photo-32909265.jpeg?auto=compress&cs=tinysrgb&w=1200',
    image_tile=null,
    image_source_url='https://www.pexels.com/photo/traditional-indonesian-nasi-uduk-platter-32909265/',
    image_credit='FOX ^.ᆽ.^= ∫ — Pexels Free License'
where slug='nasi-uduk-ayam-suwir';
update public.recipes
set cover_image_url='https://images.pexels.com/photos/36947004/pexels-photo-36947004.jpeg?auto=compress&cs=tinysrgb&w=1200',
    image_tile=null,
    image_source_url='https://www.pexels.com/photo/delicious-bubur-ayam-with-traditional-condiments-36947004/',
    image_credit='Noval Gani — Pexels Free License'
where slug='bubur-ayam-sederhana';
update public.recipes
set cover_image_url='https://commons.wikimedia.org/wiki/Special:FilePath/Ayam_Woku_1.jpg?width=1200',
    image_tile=null,
    image_source_url='https://commons.wikimedia.org/wiki/File:Ayam_Woku_1.jpg',
    image_credit='Sofi Solihah — CC BY 4.0'
where slug='ayam-woku-kemangi';
commit;
