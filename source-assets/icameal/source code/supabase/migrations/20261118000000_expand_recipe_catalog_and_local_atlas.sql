-- IcaMeal recipe catalog extension (recipes 21–30).
-- Idempotent seed: safe to re-run after a fresh database restore.

begin;

alter table public.recipes
  add column if not exists image_tile smallint;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.recipes'::regclass
      and conname = 'recipes_image_tile_check'
  ) then
    alter table public.recipes
      add constraint recipes_image_tile_check
      check (image_tile is null or image_tile between 1 and 12);
  end if;
end $$;

insert into public.ingredients (name, category, default_unit) values
  ('Daun seledri','vegetable','g'),
  ('Ikan kembung','protein','g'),
  ('Bihun','carbohydrate','g'),
  ('Tepung tapioka','other','g'),
  ('Tepung terigu','other','g'),
  ('Daun pisang','other','lembar'),
  ('Bawang bombay','seasoning','g'),
  ('Beras','carbohydrate','g'),
  ('Kerupuk','other','g'),
  ('Cakwe','other','g'),
  ('Kencur','seasoning','g'),
  ('Kemiri','seasoning','g'),
  ('Ketumbar','seasoning','g'),
  ('Merica bubuk','seasoning','g'),
  ('Gula merah','seasoning','g'),
  ('Daun pandan','seasoning','lembar'),
  ('Bawang goreng','seasoning','g'),
  ('Garam','seasoning','g'),
  ('Serai','seasoning','batang')
on conflict (name) do update
set category = excluded.category,
    default_unit = excluded.default_unit;

insert into public.recipes (
  slug,title,description,cover_image_url,image_source_url,image_credit,
  prep_time_minutes,difficulty,estimated_cost_idr,calories,protein_g,carbs_g,
  fat_g,tags,access_tier,is_published,sort_order,image_tile
) values
  ('perkedel-kentang','Perkedel kentang','Perkedel kentang rumahan dengan bagian luar keemasan dan bagian dalam lembut, cocok menjadi lauk atau camilan.','/assets/recipes/recipe-atlas.svg','https://github.com/mashirowannabe/ICAMEAL/tree/main/assets/recipes','IcaMeal — original food illustration',25,'easy',8500,260,7,34,11,array['hemat'],'premium',true,21,3),
  ('ikan-kembung-balado','Ikan kembung balado','Ikan kembung goreng disiram sambal balado merah yang pedas, gurih, dan segar.','/assets/recipes/recipe-atlas.svg','https://github.com/mashirowannabe/ICAMEAL/tree/main/assets/recipes','IcaMeal — original food illustration',30,'medium',16000,390,29,18,20,array['protein'],'premium',true,22,4),
  ('oseng-buncis-wortel-telur','Oseng buncis wortel telur','Tumis buncis dan wortel renyah dengan telur orak-arik, praktis untuk makan sehari-hari.','/assets/recipes/recipe-atlas.svg','https://github.com/mashirowannabe/ICAMEAL/tree/main/assets/recipes','IcaMeal — original food illustration',15,'easy',8500,280,13,22,14,array['protein','hemat'],'premium',true,23,5),
  ('bihun-goreng-sayur','Bihun goreng sayur','Bihun goreng sederhana dengan pakcoy, kol, tauge, dan wortel tanpa tambahan daging atau telur.','/assets/recipes/recipe-atlas.svg','https://github.com/mashirowannabe/ICAMEAL/tree/main/assets/recipes','IcaMeal — original food illustration',20,'easy',9000,340,7,62,8,array['vegan','hemat'],'premium',true,24,6),
  ('sup-jagung-telur','Sup jagung telur','Sup jagung manis dengan serabut telur, wortel, dan kuah gurih yang ringan.','/assets/recipes/recipe-atlas.svg','https://github.com/mashirowannabe/ICAMEAL/tree/main/assets/recipes','IcaMeal — original food illustration',20,'easy',8500,250,13,28,9,array['protein','hemat'],'premium',true,25,7),
  ('nasi-bakar-ayam-suwir','Nasi bakar ayam suwir','Nasi berbumbu berisi ayam suwir pedas dan kemangi, dibungkus daun pisang lalu dipanggang hingga harum.','/assets/recipes/recipe-atlas.svg','https://github.com/mashirowannabe/ICAMEAL/tree/main/assets/recipes','IcaMeal — original food illustration',40,'medium',15000,480,28,61,12,array['protein'],'premium',true,26,8),
  ('tahu-telur-saus-kacang','Tahu telur saus kacang','Telur dadar berisi tahu disajikan dengan saus kacang kental, tauge, dan timun segar.','/assets/recipes/recipe-atlas.svg','https://github.com/mashirowannabe/ICAMEAL/tree/main/assets/recipes','IcaMeal — original food illustration',25,'easy',11000,410,20,30,23,array['protein','hemat'],'premium',true,27,9),
  ('nasi-uduk-ayam-suwir','Nasi uduk ayam suwir','Nasi gurih santan dan rempah disajikan dengan ayam suwir berbumbu serta bawang goreng.','/assets/recipes/recipe-atlas.svg','https://github.com/mashirowannabe/ICAMEAL/tree/main/assets/recipes','IcaMeal — original food illustration',35,'medium',16000,520,27,67,17,array['protein'],'premium',true,28,10),
  ('bubur-ayam-sederhana','Bubur ayam sederhana','Bubur nasi lembut dengan suwiran ayam, daun bawang, seledri, dan bawang goreng.','/assets/recipes/recipe-atlas.svg','https://github.com/mashirowannabe/ICAMEAL/tree/main/assets/recipes','IcaMeal — original food illustration',35,'easy',11000,360,21,48,8,array['protein','hemat'],'premium',true,29,11),
  ('ayam-woku-kemangi','Ayam woku kemangi','Ayam berbumbu kuning khas Manado dengan cabai, serai, daun jeruk, tomat, dan kemangi.','/assets/recipes/recipe-atlas.svg','https://github.com/mashirowannabe/ICAMEAL/tree/main/assets/recipes','IcaMeal — original food illustration',35,'medium',15000,430,34,18,22,array['protein'],'premium',true,30,12)
on conflict (slug) do update set
  title=excluded.title,
  description=excluded.description,
  cover_image_url=excluded.cover_image_url,
  image_source_url=excluded.image_source_url,
  image_credit=excluded.image_credit,
  prep_time_minutes=excluded.prep_time_minutes,
  difficulty=excluded.difficulty,
  estimated_cost_idr=excluded.estimated_cost_idr,
  calories=excluded.calories,
  protein_g=excluded.protein_g,
  carbs_g=excluded.carbs_g,
  fat_g=excluded.fat_g,
  tags=excluded.tags,
  access_tier=excluded.access_tier,
  is_published=excluded.is_published,
  sort_order=excluded.sort_order,
  image_tile=excluded.image_tile;

update public.recipes
set cover_image_url='/assets/recipes/recipe-atlas.svg',
    image_tile=1,
    image_source_url='https://github.com/mashirowannabe/ICAMEAL/tree/main/assets/recipes',
    image_credit='IcaMeal — original food illustration'
where slug='ayam-kecap';

update public.recipes
set cover_image_url='/assets/recipes/recipe-atlas.svg',
    image_tile=2,
    image_source_url='https://github.com/mashirowannabe/ICAMEAL/tree/main/assets/recipes',
    image_credit='IcaMeal — original food illustration'
where slug='sayur-lodeh';

with seed(recipe_slug,ingredient_name,quantity,unit,sort_order) as (values
  ('perkedel-kentang','Kentang',200,'g',1),
  ('perkedel-kentang','Telur',1,'butir',2),
  ('perkedel-kentang','Bawang merah',10,'g',3),
  ('perkedel-kentang','Bawang putih',5,'g',4),
  ('perkedel-kentang','Daun seledri',5,'g',5),
  ('perkedel-kentang','Tepung tapioka',10,'g',6),
  ('perkedel-kentang','Garam',2,'g',7),
  ('perkedel-kentang','Merica bubuk',1,'g',8),
  ('perkedel-kentang','Minyak goreng',15,'ml',9),

  ('ikan-kembung-balado','Ikan kembung',120,'g',1),
  ('ikan-kembung-balado','Cabai',20,'g',2),
  ('ikan-kembung-balado','Bawang merah',15,'g',3),
  ('ikan-kembung-balado','Bawang putih',5,'g',4),
  ('ikan-kembung-balado','Tomat',40,'g',5),
  ('ikan-kembung-balado','Jeruk nipis',0.5,'buah',6),
  ('ikan-kembung-balado','Garam',2,'g',7),
  ('ikan-kembung-balado','Minyak goreng',15,'ml',8),

  ('oseng-buncis-wortel-telur','Buncis',70,'g',1),
  ('oseng-buncis-wortel-telur','Wortel',50,'g',2),
  ('oseng-buncis-wortel-telur','Telur',1,'butir',3),
  ('oseng-buncis-wortel-telur','Bawang putih',5,'g',4),
  ('oseng-buncis-wortel-telur','Bawang merah',10,'g',5),
  ('oseng-buncis-wortel-telur','Kecap manis',5,'ml',6),
  ('oseng-buncis-wortel-telur','Minyak goreng',8,'ml',7),

  ('bihun-goreng-sayur','Bihun',60,'g',1),
  ('bihun-goreng-sayur','Wortel',30,'g',2),
  ('bihun-goreng-sayur','Pakcoy',30,'g',3),
  ('bihun-goreng-sayur','Kol',30,'g',4),
  ('bihun-goreng-sayur','Tauge',30,'g',5),
  ('bihun-goreng-sayur','Bawang putih',5,'g',6),
  ('bihun-goreng-sayur','Kecap manis',10,'ml',7),
  ('bihun-goreng-sayur','Minyak goreng',8,'ml',8),

  ('sup-jagung-telur','Jagung manis',80,'g',1),
  ('sup-jagung-telur','Telur',1,'butir',2),
  ('sup-jagung-telur','Ayam',40,'g',3),
  ('sup-jagung-telur','Wortel',30,'g',4),
  ('sup-jagung-telur','Daun bawang',5,'g',5),
  ('sup-jagung-telur','Bawang putih',5,'g',6),
  ('sup-jagung-telur','Kaldu bubuk',2,'g',7),
  ('sup-jagung-telur','Maizena',5,'g',8),

  ('nasi-bakar-ayam-suwir','Beras',90,'g',1),
  ('nasi-bakar-ayam-suwir','Ayam',100,'g',2),
  ('nasi-bakar-ayam-suwir','Daun pisang',1,'lembar',3),
  ('nasi-bakar-ayam-suwir','Santan',30,'ml',4),
  ('nasi-bakar-ayam-suwir','Bawang merah',10,'g',5),
  ('nasi-bakar-ayam-suwir','Bawang putih',5,'g',6),
  ('nasi-bakar-ayam-suwir','Cabai',5,'g',7),
  ('nasi-bakar-ayam-suwir','Daun jeruk',1,'lembar',8),
  ('nasi-bakar-ayam-suwir','Daun kemangi',5,'g',9),
  ('nasi-bakar-ayam-suwir','Serai',1,'batang',10),

  ('tahu-telur-saus-kacang','Tahu',100,'g',1),
  ('tahu-telur-saus-kacang','Telur',1,'butir',2),
  ('tahu-telur-saus-kacang','Kacang tanah',25,'g',3),
  ('tahu-telur-saus-kacang','Tauge',30,'g',4),
  ('tahu-telur-saus-kacang','Timun',30,'g',5),
  ('tahu-telur-saus-kacang','Kecap manis',5,'ml',6),
  ('tahu-telur-saus-kacang','Bawang putih',5,'g',7),
  ('tahu-telur-saus-kacang','Cabai',3,'g',8),
  ('tahu-telur-saus-kacang','Minyak goreng',10,'ml',9),

  ('nasi-uduk-ayam-suwir','Beras',90,'g',1),
  ('nasi-uduk-ayam-suwir','Ayam',80,'g',2),
  ('nasi-uduk-ayam-suwir','Santan',50,'ml',3),
  ('nasi-uduk-ayam-suwir','Daun pandan',1,'lembar',4),
  ('nasi-uduk-ayam-suwir','Serai',1,'batang',5),
  ('nasi-uduk-ayam-suwir','Daun salam',1,'lembar',6),
  ('nasi-uduk-ayam-suwir','Bawang goreng',5,'g',7),
  ('nasi-uduk-ayam-suwir','Bawang putih',5,'g',8),
  ('nasi-uduk-ayam-suwir','Bawang merah',10,'g',9),

  ('bubur-ayam-sederhana','Beras',70,'g',1),
  ('bubur-ayam-sederhana','Ayam',70,'g',2),
  ('bubur-ayam-sederhana','Daun bawang',5,'g',3),
  ('bubur-ayam-sederhana','Daun seledri',5,'g',4),
  ('bubur-ayam-sederhana','Bawang putih',5,'g',5),
  ('bubur-ayam-sederhana','Kaldu bubuk',2,'g',6),
  ('bubur-ayam-sederhana','Bawang goreng',5,'g',7),
  ('bubur-ayam-sederhana','Garam',1,'g',8),

  ('ayam-woku-kemangi','Ayam',120,'g',1),
  ('ayam-woku-kemangi','Daun kemangi',10,'g',2),
  ('ayam-woku-kemangi','Cabai',15,'g',3),
  ('ayam-woku-kemangi','Bawang merah',15,'g',4),
  ('ayam-woku-kemangi','Bawang putih',5,'g',5),
  ('ayam-woku-kemangi','Kunyit',5,'g',6),
  ('ayam-woku-kemangi','Serai',1,'batang',7),
  ('ayam-woku-kemangi','Daun jeruk',2,'lembar',8),
  ('ayam-woku-kemangi','Tomat',40,'g',9),
  ('ayam-woku-kemangi','Jeruk nipis',0.5,'buah',10),
  ('ayam-woku-kemangi','Minyak goreng',10,'ml',11)
)
insert into public.recipe_ingredients (recipe_id,ingredient_id,quantity,unit,sort_order)
select r.id,i.id,s.quantity,s.unit,s.sort_order
from seed s
join public.recipes r on r.slug=s.recipe_slug
join public.ingredients i on i.name=s.ingredient_name
on conflict (recipe_id,ingredient_id) do update set
  quantity=excluded.quantity,
  unit=excluded.unit,
  sort_order=excluded.sort_order;

with seed(recipe_slug,step_number,instruction) as (values
  ('perkedel-kentang',1,'Goreng atau kukus kentang hingga empuk, lalu haluskan selagi hangat.'),
  ('perkedel-kentang',2,'Tumis bawang merah dan bawang putih, campurkan ke kentang bersama seledri, garam, merica, dan tapioka.'),
  ('perkedel-kentang',3,'Bentuk adonan menjadi bulatan pipih, celupkan ke telur kocok, lalu goreng hingga keemasan.'),

  ('ikan-kembung-balado',1,'Bersihkan ikan, lumuri jeruk nipis dan garam, diamkan 10 menit lalu goreng hingga matang.'),
  ('ikan-kembung-balado',2,'Haluskan cabai, bawang merah, bawang putih, dan tomat. Tumis hingga harum dan matang.'),
  ('ikan-kembung-balado',3,'Bumbui sambal, masukkan ikan goreng, aduk perlahan hingga terbalut. Sajikan hangat.'),

  ('oseng-buncis-wortel-telur',1,'Iris buncis dan wortel tipis agar cepat matang.'),
  ('oseng-buncis-wortel-telur',2,'Tumis bawang merah dan bawang putih, masukkan telur lalu orak-arik.'),
  ('oseng-buncis-wortel-telur',3,'Masukkan buncis dan wortel, bumbui kecap dan garam, tumis hingga sayuran renyah matang.'),

  ('bihun-goreng-sayur',1,'Rendam bihun dengan air hangat hingga lunak, kemudian tiriskan.'),
  ('bihun-goreng-sayur',2,'Tumis bawang putih, masukkan wortel, kol, pakcoy, dan tauge.'),
  ('bihun-goreng-sayur',3,'Masukkan bihun dan kecap manis, aduk hingga bumbu rata dan sayuran matang.'),

  ('sup-jagung-telur',1,'Tumis bawang putih, tambahkan ayam dan masak hingga berubah warna.'),
  ('sup-jagung-telur',2,'Tuang air dan masukkan jagung, wortel, serta kaldu bubuk. Rebus hingga sayuran empuk.'),
  ('sup-jagung-telur',3,'Tuang telur kocok perlahan sambil diaduk, tambahkan larutan maizena dan daun bawang.'),

  ('nasi-bakar-ayam-suwir',1,'Masak beras bersama santan, serai, dan daun jeruk hingga menjadi nasi gurih.'),
  ('nasi-bakar-ayam-suwir',2,'Tumis bawang dan cabai, masukkan ayam suwir serta kemangi, masak hingga bumbu meresap.'),
  ('nasi-bakar-ayam-suwir',3,'Isi daun pisang dengan nasi dan ayam suwir, bungkus rapat lalu panggang hingga daun harum dan sedikit kecokelatan.'),

  ('tahu-telur-saus-kacang',1,'Potong tahu kecil, campur dengan telur kocok, lalu goreng menjadi dadar hingga kedua sisi matang.'),
  ('tahu-telur-saus-kacang',2,'Haluskan kacang tanah, bawang putih, cabai, kecap manis, dan air hangat hingga menjadi saus kental.'),
  ('tahu-telur-saus-kacang',3,'Potong dadar tahu telur, sajikan bersama tauge, timun, dan saus kacang.'),

  ('nasi-uduk-ayam-suwir',1,'Masak beras dengan santan, serai, daun pandan, daun salam, dan sedikit garam hingga matang.'),
  ('nasi-uduk-ayam-suwir',2,'Rebus ayam hingga matang, suwir, lalu tumis sebentar dengan bawang putih dan bawang merah.'),
  ('nasi-uduk-ayam-suwir',3,'Sajikan nasi uduk dengan ayam suwir dan taburan bawang goreng.'),

  ('bubur-ayam-sederhana',1,'Masak beras dengan air dan kaldu hingga pecah menjadi bubur lembut, aduk berkala.'),
  ('bubur-ayam-sederhana',2,'Rebus ayam hingga matang, suwir, lalu bumbui ringan.'),
  ('bubur-ayam-sederhana',3,'Sajikan bubur dengan ayam suwir, daun bawang, seledri, dan bawang goreng.'),

  ('ayam-woku-kemangi',1,'Lumuri ayam dengan jeruk nipis dan sedikit garam. Haluskan cabai, bawang merah, bawang putih, dan kunyit.'),
  ('ayam-woku-kemangi',2,'Tumis bumbu halus bersama serai dan daun jeruk hingga harum. Masukkan ayam dan aduk rata.'),
  ('ayam-woku-kemangi',3,'Tambahkan sedikit air dan tomat, masak hingga ayam matang. Masukkan kemangi menjelang api dimatikan.')
)
insert into public.recipe_steps (recipe_id,step_number,instruction)
select r.id,s.step_number,s.instruction
from seed s
join public.recipes r on r.slug=s.recipe_slug
on conflict (recipe_id,step_number) do update set
  instruction=excluded.instruction;

-- Keep this ingredient in one canonical unit so it aggregates under the
-- shopping_list_items unique key (shopping_list_id, ingredient_id).
update public.recipe_ingredients ri
set quantity=ri.quantity / 20,
    unit='batang'
from public.ingredients i
where i.id=ri.ingredient_id and i.name='Serai' and ri.unit='g';

update public.ingredients
set default_unit='batang'
where name='Serai';

commit;
