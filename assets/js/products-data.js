/* ================================================================
   Milk — Product Data Store
   ================================================================
   Single source of truth for all product content.
   Consumed by: products.html, products-ar.html, and every
   product-{id}.html / product-{id}-ar.html page.

   Usage:
     - Include this file via <script src="assets/js/products-data.js">
       BEFORE main.js on any page that needs product data.
     - Access the array as: window.FFY_PRODUCTS
   ================================================================ */

window.FFY_PRODUCTS = [

  /* ----------------------------------------------------------
     1. Milk — Strawberry Smoothie Bowl
     ---------------------------------------------------------- */
  {
    id: 'berry-pure',
    badge_en: 'Bestseller',
    badge_ar: 'الأكثر مبيعًا',
    badgeColor: '#C90035',
    name_en: 'Milk',
    name_ar: 'ميلك',
    tagline_en: 'Creamy strawberry perfection, handcrafted every morning.',
    tagline_ar: 'كمال الفراولة الكريمية المصنوع يدويًا كل صباح.',
    description_en: 'Fresh strawberries, luscious cream, and delicate white chocolate pieces blended into one smooth, dreamy dessert. Our signature creation — born from the very first recipe that launched Milk in 2012. Every spoonful is a celebration of the finest seasonal strawberries, picked at peak ripeness and transformed into something truly extraordinary. Served fresh, never frozen.',
    description_ar: 'فراولة طازجة وكريمة غنية وقطع شوكولاتة بيضاء رقيقة تُمزج في حلوى ناعمة وحالمة. إبداعنا الأصيل — وُلد من أول وصفة أطلقت ميلك عام ٢٠١٢. كل ملعقة احتفال بأجود فراولة الموسم المقطوفة في ذروة نضجها والمحوّلة إلى شيء استثنائي حقًا. تُقدَّم طازجة، لا مجمّدة أبدًا.',
    price: 8.90,
    category: 'smoothie-bowl',
    category_en: 'Smoothie Bowl',
    category_ar: 'طبق سموذي',
    image_main: 'assets/images/strawberry-bowl.png',
    image_alt_en: 'Milk strawberry smoothie bowl with white chocolate',
    image_alt_ar: 'طبق سموذي ميلك بالفراولة والشوكولاتة البيضاء',
    image_gallery: [
      'assets/images/strawberry-bowl.png',
      'assets/images/strawberry-scoop.png',
      'assets/images/strawberry.png'
    ],
    ingredients_en: ['Fresh strawberries', 'Organic cream', 'White chocolate pieces', 'Vanilla bean', 'Raw honey'],
    ingredients_ar: ['فراولة طازجة', 'كريمة عضوية', 'قطع شوكولاتة بيضاء', 'حبة فانيليا', 'عسل خام'],
    allergens_en: ['Dairy', 'May contain traces of nuts'],
    allergens_ar: ['منتجات الألبان', 'قد يحتوي على آثار من المكسرات'],
    nutrition: { calories: 280, protein: '4g', fat: '11g', carbs: '38g', sugar: '28g' },
    isAvailable: true,
    isFeatured: true,
    relatedIds: ['blue-bliss', 'banana-crush']
  },

  /* ----------------------------------------------------------
     2. Blue Bliss — Blueberry Ice Cream Bowl
     ---------------------------------------------------------- */
  {
    id: 'blue-bliss',
    badge_en: 'Fan Favourite',
    badge_ar: 'المفضّل لدى الجميع',
    badgeColor: '#3B1FBF',
    name_en: 'Blue Bliss',
    name_ar: 'بلو بليس',
    tagline_en: 'A refreshing wave of sun-kissed blueberry indulgence.',
    tagline_ar: 'موجة منعشة من التوت الأزرق الناضج في الشمس.',
    description_en: 'A smooth, refreshing blueberry ice cream made with ripe, sun-kissed berries harvested at their flavour peak. Rich in natural antioxidants and bursting with vibrant berry taste, Blue Bliss is perfectly balanced — not too sweet, never too tart. It\'s a gentle, elegant dessert that pairs beautifully with a warm afternoon or a quiet moment of indulgence.',
    description_ar: 'آيس كريم توت أزرق ناعم ومنعش مصنوع من حبات ناضجة اكتسبت نكهتها تحت أشعة الشمس في ذروة جودتها. غني بمضادات الأكسدة الطبيعية وممتلئ بطعم التوت الزاهي، بلو بليس متوازن تمامًا — ليس حلوًا مفرطًا ولا حامضًا. حلوى رقيقة وأنيقة تتناسق مع فترة ما بعد الظهيرة الدافئة أو لحظة هادئة من التدليل.',
    price: 8.90,
    category: 'ice-cream',
    category_en: 'Ice Cream',
    category_ar: 'آيس كريم',
    image_main: 'assets/images/blueberry-bowl.png',
    image_alt_en: 'Blue Bliss blueberry ice cream bowl',
    image_alt_ar: 'طبق آيس كريم التوت الأزرق بلو بليس',
    image_gallery: [
      'assets/images/blueberry-bowl.png',
      'assets/images/blueberry-scoop-1.png',
      'assets/images/blueberry-scoop-2.png'
    ],
    ingredients_en: ['Fresh blueberries', 'Organic cream', 'Cane sugar', 'Lemon zest', 'Vanilla extract'],
    ingredients_ar: ['توت أزرق طازج', 'كريمة عضوية', 'سكر القصب', 'قشر الليمون', 'مستخلص الفانيليا'],
    allergens_en: ['Dairy'],
    allergens_ar: ['منتجات الألبان'],
    nutrition: { calories: 240, protein: '3g', fat: '9g', carbs: '34g', sugar: '26g' },
    isAvailable: true,
    isFeatured: true,
    relatedIds: ['berry-pure', 'kiwi-flavor']
  },

  /* ----------------------------------------------------------
     3. Banana Crush — Creamy Banana Ice Cream
     ---------------------------------------------------------- */
  {
    id: 'banana-crush',
    badge_en: 'New',
    badge_ar: 'جديد',
    badgeColor: '#B87A00',
    name_en: 'Banana Crush',
    name_ar: 'بانانا كراش',
    tagline_en: 'Silky banana meets a whisper of vanilla — pure comfort.',
    tagline_ar: 'موزة حريرية مع لمسة من الفانيليا — راحة نقية.',
    description_en: 'A smooth and velvety banana ice cream elevated with a delicate hint of pure vanilla. Made from naturally ripened bananas — no artificial flavours, no shortcuts. Banana Crush is our newest creation, developed by popular demand from customers who wanted the warmth and comfort of a classic banana dessert elevated to artisan quality. Satisfying for any time of day, any season.',
    description_ar: 'آيس كريم موز ناعم ومخملي مرفوع بلمسة رقيقة من الفانيليا الخالصة. مصنوع من موز ناضج طبيعيًا — بدون نكهات صناعية، ولا حلول وسطى. بانانا كراش إبداعنا الأحدث، طُوِّر استجابةً لطلب عملائنا الراغبين في دفء حلوى الموز الكلاسيكية بجودة حرفية راقية. مُشبع في أي وقت من اليوم وأي موسم.',
    price: 8.90,
    category: 'smoothie-bowl',
    category_en: 'Smoothie Bowl',
    category_ar: 'طبق سموذي',
    image_main: 'assets/images/banana-bowl.png',
    image_alt_en: 'Banana Crush creamy banana ice cream bowl with vanilla',
    image_alt_ar: 'طبق آيس كريم الموز بانانا كراش مع الفانيليا',
    image_gallery: [
      'assets/images/banana-bowl.png',
      'assets/images/banana-scoop-1.png',
      'assets/images/banana-scoop-2.png'
    ],
    ingredients_en: ['Ripe bananas', 'Organic cream', 'Vanilla bean', 'Raw cane sugar', 'Pinch of sea salt'],
    ingredients_ar: ['موز ناضج', 'كريمة عضوية', 'حبة فانيليا', 'سكر قصب خام', 'رشة ملح البحر'],
    allergens_en: ['Dairy'],
    allergens_ar: ['منتجات الألبان'],
    nutrition: { calories: 260, protein: '3g', fat: '10g', carbs: '40g', sugar: '30g' },
    isAvailable: true,
    isFeatured: false,
    relatedIds: ['berry-pure', 'blue-bliss']
  },

  /* ----------------------------------------------------------
     4. Kiwi Flavor — Refreshing Kiwi Ice Cream
     ---------------------------------------------------------- */
  {
    id: 'kiwi-flavor',
    badge_en: 'Seasonal',
    badge_ar: 'موسمي',
    badgeColor: '#2E7D32',
    name_en: 'Kiwi Flavor',
    name_ar: 'نكهة الكيوي',
    tagline_en: 'Bright, vibrant, and refreshingly unexpected.',
    tagline_ar: 'مشرق وزاهٍ ومنعش بشكل غير متوقع.',
    description_en: 'A smooth and intensely refreshing kiwi ice cream that surprises with every spoonful. Made from peak-season golden and green kiwis, this vibrant creation balances natural tartness with creamy sweetness in a way that feels entirely unique. Light enough to enjoy daily, distinctive enough to remember. A seasonal treasure — available only while kiwis are at their finest.',
    description_ar: 'آيس كريم كيوي ناعم ومنعش بشدة يفاجئك في كل ملعقة. مصنوع من كيوي ذهبي وأخضر في موسم ذروته، يوازن هذا الإبداع الزاهي بين الحموضة الطبيعية والحلاوة الكريمية بطريقة فريدة تمامًا. خفيف بما يكفي للاستمتاع اليومي، مميز بما يكفي ليُذكَر. كنز موسمي — متاح فقط حين يكون الكيوي في أفضل حالاته.',
    price: 8.90,
    category: 'seasonal',
    category_en: 'Seasonal Special',
    category_ar: 'عرض موسمي',
    image_main: 'assets/images/kiwi-bowl.png',
    image_alt_en: 'Kiwi Flavor refreshing kiwi ice cream bowl',
    image_alt_ar: 'طبق آيس كريم نكهة الكيوي المنعش',
    image_gallery: [
      'assets/images/kiwi-bowl.png',
      'assets/images/kiwi-scoop-1.png',
      'assets/images/kiwi-scoop-2.png'
    ],
    ingredients_en: ['Golden kiwi', 'Green kiwi', 'Organic cream', 'Lime juice', 'Raw cane sugar'],
    ingredients_ar: ['كيوي ذهبي', 'كيوي أخضر', 'كريمة عضوية', 'عصير الليمون', 'سكر قصب خام'],
    allergens_en: ['Dairy'],
    allergens_ar: ['منتجات الألبان'],
    nutrition: { calories: 220, protein: '3g', fat: '8g', carbs: '32g', sugar: '24g' },
    isAvailable: true,
    isFeatured: false,
    relatedIds: ['blue-bliss', 'berry-pure']
  }

];
/* ================================================================
   END FFY_PRODUCTS
   ================================================================ */
