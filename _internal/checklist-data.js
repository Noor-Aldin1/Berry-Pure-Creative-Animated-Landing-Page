/* ================================================================
   Milk — Product Checklist Data
   ================================================================
   Single source of truth for all product-specific checklist items.

   Structure:
     window.FFY_CHECKLIST_DATA[productId].sections[]
       .id          — unique section identifier
       .title_en    — section heading (English)
       .title_ar    — section heading (Arabic)
       .icon        — Font Awesome class (e.g. 'fa-play-circle')
       .items[]
         .id        — unique item identifier (scoped to section)
         .title_en  — item label (English)
         .title_ar  — item label (Arabic)
         .desc_en   — optional detail/instruction (English)
         .desc_ar   — optional detail/instruction (Arabic)
         .order     — display order (ascending)

   State is persisted in localStorage per product:
     Key: berrypure_checklist_<productId>
     Value: { '<sectionId>__<itemId>': true | false }
   ================================================================ */

window.FFY_CHECKLIST_DATA = {

  /* ----------------------------------------------------------
     1. Milk — Strawberry Smoothie Bowl
     ---------------------------------------------------------- */
  'berry-pure': {
    sections: [
      {
        id: 'order',
        title_en: 'Placing Your Order',
        title_ar: 'تقديم طلبك',
        icon: 'fa-bag-shopping',
        items: [
          {
            id: 'choose-size',
            title_en: 'Choose your serving size',
            title_ar: 'اختر حجم الوجبة',
            desc_en: 'Available in regular and large. The large serving adds an extra layer of cream and toppings.',
            desc_ar: 'متاح بحجم عادي وكبير. الحجم الكبير يُضاف إليه طبقة إضافية من الكريمة والإضافات.',
            order: 1
          },
          {
            id: 'confirm-allergens',
            title_en: 'Review allergen information',
            title_ar: 'مراجعة معلومات المواد المسببة للحساسية',
            desc_en: 'Milk contains dairy and may contain traces of nuts. Always confirm before ordering.',
            desc_ar: 'يحتوي ميلك على منتجات الألبان وقد يحتوي على آثار من المكسرات. تأكد دائمًا قبل الطلب.',
            order: 2
          },
          {
            id: 'place-order',
            title_en: 'Submit your order',
            title_ar: 'قدِّم طلبك',
            desc_en: 'Order in-store or via our team. Milk is made fresh — allow 5–8 minutes preparation time.',
            desc_ar: 'الطلب داخل المتجر أو عبر فريقنا. يُحضَّر ميلك طازجًا — انتظر ٥–٨ دقائق للتحضير.',
            order: 3
          }
        ]
      },
      {
        id: 'setup',
        title_en: 'Setting the Scene',
        title_ar: 'تهيئة الأجواء',
        icon: 'fa-star',
        items: [
          {
            id: 'pick-spot',
            title_en: 'Find your perfect spot',
            title_ar: 'اختر مكانك المثالي',
            desc_en: 'Milk tastes best enjoyed slowly. Choose a calm, comfortable setting.',
            desc_ar: 'ميلك يُستمتع به على مهل. اختر مكانًا هادئًا ومريحًا.',
            order: 1
          },
          {
            id: 'utensils',
            title_en: 'Prepare a wide, shallow spoon',
            title_ar: 'جهِّز ملعقة واسعة وضحلة',
            desc_en: 'A wider spoon lets you scoop strawberries, cream, and chocolate pieces in every bite.',
            desc_ar: 'تتيح لك الملعقة الأوسع أن تتناول الفراولة والكريمة وقطع الشوكولاتة في كل قضمة.',
            order: 2
          }
        ]
      },
      {
        id: 'tasting',
        title_en: 'The Tasting Journey',
        title_ar: 'رحلة التذوق',
        icon: 'fa-heart',
        items: [
          {
            id: 'first-taste',
            title_en: 'Take your first spoonful',
            title_ar: 'تناول الملعقة الأولى',
            desc_en: 'Let the creamy strawberry base rest on your palate for a moment before you swallow.',
            desc_ar: 'دع قاعدة الفراولة الكريمية تستقر على حنكك لحظةً قبل أن تبتلعها.',
            order: 1
          },
          {
            id: 'find-chocolate',
            title_en: 'Discover the white chocolate pieces',
            title_ar: 'اكتشف قطع الشوكولاتة البيضاء',
            desc_en: 'They melt slowly and add a gentle sweetness that balances the berry tartness.',
            desc_ar: 'تذوب ببطء وتضيف حلاوة لطيفة توازن حموضة التوت.',
            order: 2
          },
          {
            id: 'vanilla-note',
            title_en: 'Notice the vanilla bean finish',
            title_ar: 'لاحظ النهاية بحبة الفانيليا',
            desc_en: 'After the strawberry and cream, a subtle vanilla warmth completes each bite.',
            desc_ar: 'بعد الفراولة والكريمة، تُكمل دفء الفانيليا الرقيقة كل قضمة.',
            order: 3
          },
          {
            id: 'texture',
            title_en: 'Appreciate the texture contrast',
            title_ar: 'استمتع بتباين القوام',
            desc_en: 'Notice how the smooth base contrasts with the chunky fresh strawberry pieces.',
            desc_ar: 'لاحظ كيف يتناقض القاعدة الناعمة مع قطع الفراولة الطازجة الكثيفة.',
            order: 4
          }
        ]
      },
      {
        id: 'experience',
        title_en: 'Complete the Experience',
        title_ar: 'أكمل التجربة',
        icon: 'fa-check-circle',
        items: [
          {
            id: 'rate',
            title_en: 'Rate your Milk experience',
            title_ar: 'قيِّم تجربتك مع ميلك',
            desc_en: 'Use our in-store feedback card or leave a review online to help us improve.',
            desc_ar: 'استخدم بطاقة التعليقات داخل المتجر أو اترك مراجعة عبر الإنترنت لمساعدتنا على التحسين.',
            order: 1
          },
          {
            id: 'compare',
            title_en: 'Compare with another Milk flavour',
            title_ar: 'قارن مع نكهة أخرى من ميلك',
            desc_en: 'Try Blue Bliss or Banana Crush next to discover how each flavour has its own character.',
            desc_ar: 'جرب بلو بليس أو بانانا كراش لاحقًا لتكتشف كيف أن لكل نكهة شخصيتها الخاصة.',
            order: 2
          },
          {
            id: 'share',
            title_en: 'Share your moment',
            title_ar: 'شارك لحظتك',
            desc_en: 'Tag us on Instagram @BerryPure — we love seeing your enjoyment.',
            desc_ar: 'ذكِّرنا على إنستغرام @BerryPure — نحب رؤية استمتاعك.',
            order: 3
          }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     2. Blue Bliss — Blueberry Ice Cream Bowl
     ---------------------------------------------------------- */
  'blue-bliss': {
    sections: [
      {
        id: 'order',
        title_en: 'Before You Order',
        title_ar: 'قبل الطلب',
        icon: 'fa-bag-shopping',
        items: [
          {
            id: 'check-availability',
            title_en: 'Confirm Blue Bliss is available today',
            title_ar: 'تأكد من توفر بلو بليس اليوم',
            desc_en: 'Blue Bliss uses peak-season blueberries. Availability may vary — check with our team.',
            desc_ar: 'يستخدم بلو بليس توتًا أزرق في موسم ذروته. قد تتفاوت التوافرية — تحقق مع فريقنا.',
            order: 1
          },
          {
            id: 'allergens',
            title_en: 'Review allergen information',
            title_ar: 'راجع معلومات المواد المسببة للحساسية',
            desc_en: 'Blue Bliss contains dairy. Suitable for those with nut allergies.',
            desc_ar: 'يحتوي بلو بليس على منتجات الألبان. مناسب لمن يعانون من حساسية المكسرات.',
            order: 2
          },
          {
            id: 'place-order',
            title_en: 'Place your order',
            title_ar: 'قدِّم طلبك',
            desc_en: 'Served fresh and cold. Ask for extra lemon zest if you like a sharper citrus edge.',
            desc_ar: 'يُقدَّم طازجًا وباردًا. اطلب قشر ليمون إضافيًا إذا كنت تفضل طعمًا حامضًا أكثر حدةً.',
            order: 3
          }
        ]
      },
      {
        id: 'preparation',
        title_en: 'Preparing Your Moment',
        title_ar: 'تحضير اللحظة',
        icon: 'fa-star',
        items: [
          {
            id: 'chill-spoon',
            title_en: 'Use a cold spoon for first taste',
            title_ar: 'استخدم ملعقة باردة للتذوق الأول',
            desc_en: 'A pre-chilled spoon prevents the ice cream from melting too quickly on first contact.',
            desc_ar: 'الملعقة المبردة مسبقًا تمنع ذوبان الآيس كريم بسرعة عند أول ملامسة.',
            order: 1
          },
          {
            id: 'quiet-setting',
            title_en: 'Choose a relaxed, comfortable setting',
            title_ar: 'اختر مكانًا هادئًا ومريحًا',
            desc_en: 'Blue Bliss is an elegant, quiet pleasure. Savour it in a calm environment.',
            desc_ar: 'بلو بليس متعة أنيقة وهادئة. استمتع به في بيئة هادئة.',
            order: 2
          }
        ]
      },
      {
        id: 'tasting',
        title_en: 'The Tasting Journey',
        title_ar: 'رحلة التذوق',
        icon: 'fa-heart',
        items: [
          {
            id: 'first-scoop',
            title_en: 'Take the first scoop slowly',
            title_ar: 'خذ السكوب الأول ببطء',
            desc_en: 'Let the ice cream begin to melt on your tongue — notice the first wave of blueberry.',
            desc_ar: 'دع الآيس كريم يبدأ في الذوبان على لسانك — لاحظ الموجة الأولى من التوت الأزرق.',
            order: 1
          },
          {
            id: 'lemon-note',
            title_en: 'Identify the lemon zest brightness',
            title_ar: 'تعرَّف على لمعة قشر الليمون',
            desc_en: 'After the blueberry richness, a citrus brightness lifts the flavour — that is lemon zest.',
            desc_ar: 'بعد ثراء التوت الأزرق، تُضيء حيوية الحمضيات النكهةَ — هذا هو قشر الليمون.',
            order: 2
          },
          {
            id: 'sweetness-balance',
            title_en: 'Notice the sweetness balance',
            title_ar: 'لاحظ توازن الحلاوة',
            desc_en: 'Blue Bliss is intentionally not too sweet. The natural cane sugar just elevates the berry.',
            desc_ar: 'بلو بليس مُصمَّم ليكون غير حلو بشكل مفرط. سكر القصب الطبيعي يُعلي النكهة فقط.',
            order: 3
          },
          {
            id: 'antioxidants',
            title_en: 'Appreciate the deep colour richness',
            title_ar: 'استمتع بثراء اللون الغامق',
            desc_en: 'The deep purple hue comes from the blueberries natural antioxidants — a sign of quality.',
            desc_ar: 'اللون البنفسجي الغامق يأتي من مضادات الأكسدة الطبيعية في التوت الأزرق — علامة الجودة.',
            order: 4
          }
        ]
      },
      {
        id: 'experience',
        title_en: 'Complete the Experience',
        title_ar: 'أكمل التجربة',
        icon: 'fa-check-circle',
        items: [
          {
            id: 'temperature-test',
            title_en: 'Try a spoonful after a short rest',
            title_ar: 'جرب ملعقة بعد استراحة قصيرة',
            desc_en: 'Let it rest 2 minutes before finishing — the slightly softer texture reveals new notes.',
            desc_ar: 'دعه يرتاح دقيقتين قبل الانتهاء — القوام الأكثر ليونةً يكشف عن نوتات جديدة.',
            order: 1
          },
          {
            id: 'rate',
            title_en: 'Rate your Blue Bliss experience',
            title_ar: 'قيِّم تجربتك مع بلو بليس',
            desc_en: 'Share your thoughts with us — your feedback shapes future flavour refinements.',
            desc_ar: 'شاركنا أفكارك — تعليقاتك تُشكِّل تحسينات النكهة في المستقبل.',
            order: 2
          },
          {
            id: 'share',
            title_en: 'Share your Blue Bliss moment',
            title_ar: 'شارك لحظتك مع بلو بليس',
            desc_en: 'Tag @BerryPure on social — the deep blue colour photographs beautifully.',
            desc_ar: 'ذكِّر @BerryPure على وسائل التواصل — اللون الأزرق الغامق يُصوَّر بجمال.',
            order: 3
          }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     3. Banana Crush — Creamy Banana Ice Cream
     ---------------------------------------------------------- */
  'banana-crush': {
    sections: [
      {
        id: 'order',
        title_en: 'Placing Your Order',
        title_ar: 'تقديم طلبك',
        icon: 'fa-bag-shopping',
        items: [
          {
            id: 'choose-pairing',
            title_en: 'Consider a topping pairing',
            title_ar: 'فكِّر في إضافة مكملة',
            desc_en: 'Banana Crush pairs beautifully with a drizzle of raw honey or crushed walnuts (optional add-on).',
            desc_ar: 'يتناسق بانانا كراش رائعًا مع رذاذ من العسل الخام أو الجوز المطحون (إضافة اختيارية).',
            order: 1
          },
          {
            id: 'allergens',
            title_en: 'Confirm allergen information',
            title_ar: 'تأكد من معلومات المواد المسببة للحساسية',
            desc_en: 'Contains dairy. Free from nuts in the base recipe — check for add-on allergens separately.',
            desc_ar: 'يحتوي على منتجات الألبان. خالٍ من المكسرات في الوصفة الأساسية — تحقق من إضافات الحساسية بشكل منفصل.',
            order: 2
          },
          {
            id: 'place-order',
            title_en: 'Place your order',
            title_ar: 'قدِّم طلبك',
            desc_en: 'Made from naturally ripened bananas — no shortcuts, no artificial flavours.',
            desc_ar: 'مصنوع من موز ناضج طبيعيًا — بلا حلول وسطى، بلا نكهات صناعية.',
            order: 3
          }
        ]
      },
      {
        id: 'setup',
        title_en: 'Set the Mood',
        title_ar: 'هيِّئ الأجواء',
        icon: 'fa-star',
        items: [
          {
            id: 'comfort-setting',
            title_en: 'Choose a warm, comfortable setting',
            title_ar: 'اختر مكانًا دافئًا ومريحًا',
            desc_en: 'Banana Crush is pure comfort food. It tastes best in a relaxed, unhurried moment.',
            desc_ar: 'بانانا كراش طعام راحة نقية. يُستمتع به بشكل أفضل في لحظة هادئة وغير مستعجلة.',
            order: 1
          },
          {
            id: 'time-of-day',
            title_en: 'Pick the right time of day',
            title_ar: 'اختر الوقت المناسب من اليوم',
            desc_en: 'Banana Crush is satisfying any time — but it pairs especially well with a quiet afternoon.',
            desc_ar: 'بانانا كراش مُشبع في أي وقت — لكنه يتناغم بشكل خاص مع فترة ما بعد الظهيرة الهادئة.',
            order: 2
          }
        ]
      },
      {
        id: 'tasting',
        title_en: 'The Tasting Journey',
        title_ar: 'رحلة التذوق',
        icon: 'fa-heart',
        items: [
          {
            id: 'first-taste',
            title_en: 'Take the first spoonful',
            title_ar: 'تناول الملعقة الأولى',
            desc_en: 'Notice how smooth and velvety the banana base is — almost like butter on your tongue.',
            desc_ar: 'لاحظ كيف أن قاعدة الموز ناعمة ومخملية — تكاد تكون كالزبدة على لسانك.',
            order: 1
          },
          {
            id: 'vanilla-whisper',
            title_en: 'Find the vanilla whisper',
            title_ar: 'ابحث عن همسة الفانيليا',
            desc_en: 'A delicate hint of pure vanilla runs through every spoonful — it is subtle but unmistakable.',
            desc_ar: 'تيارٌ خفي من الفانيليا الخالصة يجري في كل ملعقة — رقيق لكنه واضح لا لبس فيه.',
            order: 2
          },
          {
            id: 'sea-salt-finish',
            title_en: 'Notice the sea salt finish',
            title_ar: 'لاحظ نهاية ملح البحر',
            desc_en: 'A tiny pinch of sea salt at the end makes the sweetness bloom — taste for it in the aftertaste.',
            desc_ar: 'رشة صغيرة من ملح البحر في النهاية تجعل الحلاوة تتفتح — ابحث عنها في النكهة الباقية.',
            order: 3
          },
          {
            id: 'richness',
            title_en: 'Appreciate the cream richness',
            title_ar: 'استمتع بثراء الكريمة',
            desc_en: 'Banana Crush uses organic cream — richer and more indulgent than standard mixes.',
            desc_ar: 'يستخدم بانانا كراش كريمة عضوية — أكثر ثراءً وتدليلًا من المخاليط القياسية.',
            order: 4
          }
        ]
      },
      {
        id: 'experience',
        title_en: 'Complete the Experience',
        title_ar: 'أكمل التجربة',
        icon: 'fa-check-circle',
        items: [
          {
            id: 'compare',
            title_en: 'Compare with a classic banana dessert',
            title_ar: 'قارن مع حلوى الموز الكلاسيكية',
            desc_en: 'Think of your favourite banana dessert — notice how Banana Crush elevates that familiar comfort.',
            desc_ar: 'تذكَّر حلوى الموز المفضلة لديك — لاحظ كيف يرفع بانانا كراش تلك الراحة المألوفة.',
            order: 1
          },
          {
            id: 'rate',
            title_en: 'Rate your Banana Crush experience',
            title_ar: 'قيِّم تجربتك مع بانانا كراش',
            desc_en: 'Banana Crush was developed by popular demand — tell us if we got it right.',
            desc_ar: 'طُوِّر بانانا كراش بناءً على طلب شعبي — أخبرنا ما إذا أصبنا.',
            order: 2
          },
          {
            id: 'share',
            title_en: 'Share your moment',
            title_ar: 'شارك لحظتك',
            desc_en: 'Tag @BerryPure — help others discover this silky banana creation.',
            desc_ar: 'ذكِّر @BerryPure — ساعد الآخرين في اكتشاف هذا الإبداع الموزي الحريري.',
            order: 3
          }
        ]
      }
    ]
  },

  /* ----------------------------------------------------------
     4. Kiwi Flavor — Refreshing Kiwi Ice Cream
     ---------------------------------------------------------- */
  'kiwi-flavor': {
    sections: [
      {
        id: 'order',
        title_en: 'Before You Order',
        title_ar: 'قبل الطلب',
        icon: 'fa-bag-shopping',
        items: [
          {
            id: 'seasonal-check',
            title_en: 'Confirm seasonal availability',
            title_ar: 'تأكد من التوافرية الموسمية',
            desc_en: 'Kiwi Flavor is only available when golden and green kiwis are at their seasonal peak. Check with our team.',
            desc_ar: 'نكهة الكيوي متاحة فقط عندما يكون الكيوي الذهبي والأخضر في ذروة موسمه. تحقق مع فريقنا.',
            order: 1
          },
          {
            id: 'allergens',
            title_en: 'Review allergen information',
            title_ar: 'راجع معلومات المواد المسببة للحساسية',
            desc_en: 'Contains dairy. No nuts. The lime juice adds natural acidity — mention if you have citrus sensitivity.',
            desc_ar: 'يحتوي على منتجات الألبان. خالٍ من المكسرات. يُضيف عصير الليمون حموضةً طبيعية — اذكر ذلك إذا كنت حساسًا للحمضيات.',
            order: 2
          },
          {
            id: 'place-order',
            title_en: 'Place your order',
            title_ar: 'قدِّم طلبك',
            desc_en: 'A seasonal treasure — available only while kiwis are at their finest. Don\'t miss this window.',
            desc_ar: 'كنز موسمي — متاح فقط حين يكون الكيوي في أفضل حالاته. لا تفوِّت هذه الفرصة.',
            order: 3
          }
        ]
      },
      {
        id: 'preparation',
        title_en: 'Prepare Your Senses',
        title_ar: 'هيِّئ حواسك',
        icon: 'fa-star',
        items: [
          {
            id: 'clear-palate',
            title_en: 'Clear your palate before tasting',
            title_ar: 'نظِّف حنكك قبل التذوق',
            desc_en: 'Have a sip of still water to neutralise your palate — Kiwi Flavor is best enjoyed fresh.',
            desc_ar: 'اشرب رشفة من الماء الساكن لتحييد حنكك — نكهة الكيوي تُستمتع بها على أفضل وجه طازجةً.',
            order: 1
          },
          {
            id: 'set-expectations',
            title_en: 'Expect the unexpected',
            title_ar: 'توقَّع غير المتوقع',
            desc_en: 'Kiwi Flavor surprises with every spoonful — it is bright, tart, and refreshingly unique.',
            desc_ar: 'نكهة الكيوي تُفاجئك في كل ملعقة — إنها مشرقة وحامضة وفريدة بشكل منعش.',
            order: 2
          }
        ]
      },
      {
        id: 'tasting',
        title_en: 'The Tasting Journey',
        title_ar: 'رحلة التذوق',
        icon: 'fa-heart',
        items: [
          {
            id: 'first-taste',
            title_en: 'Take the first bold spoonful',
            title_ar: 'تناول الملعقة الأولى الجريئة',
            desc_en: 'Let the vivid kiwi flavour hit your palate — this is the most intense flavour burst in our range.',
            desc_ar: 'دع نكهة الكيوي النابضة بالحياة تضرب حنكك — هذا أشد انفجار للنكهة في مجموعتنا.',
            order: 1
          },
          {
            id: 'two-kiwis',
            title_en: 'Taste the golden vs green kiwi layers',
            title_ar: 'تذوَّق طبقات الكيوي الذهبي والأخضر',
            desc_en: 'Golden kiwi brings sweetness; green kiwi brings tartness. Both are present in each scoop.',
            desc_ar: 'الكيوي الذهبي يجلب الحلاوة؛ الكيوي الأخضر يجلب الحموضة. كلاهما موجود في كل سكوب.',
            order: 2
          },
          {
            id: 'lime-finish',
            title_en: 'Notice the lime juice brightness',
            title_ar: 'لاحظ لمعة عصير الليمون',
            desc_en: 'A squeeze of lime juice at the end lifts the entire flavour profile and keeps it refreshing.',
            desc_ar: 'عصرة من عصير الليمون في النهاية ترفع الملف الكامل للنكهة وتُبقيه منعشًا.',
            order: 3
          },
          {
            id: 'texture',
            title_en: 'Appreciate the light, smooth texture',
            title_ar: 'استمتع بالقوام الخفيف الناعم',
            desc_en: 'Kiwi Flavor is lighter than our other offerings — deliberately so, for a refreshing daily treat.',
            desc_ar: 'نكهة الكيوي أخف من عروضنا الأخرى — عمدًا كذلك، لتكون حلوى يومية منعشة.',
            order: 4
          }
        ]
      },
      {
        id: 'experience',
        title_en: 'Complete the Experience',
        title_ar: 'أكمل التجربة',
        icon: 'fa-check-circle',
        items: [
          {
            id: 'seasonal-memory',
            title_en: 'Mark your seasonal calendar',
            title_ar: 'ضع علامة في تقويمك الموسمي',
            desc_en: 'Note when you had Kiwi Flavor — plan to return at the same time next season.',
            desc_ar: 'سجِّل متى تناولت نكهة الكيوي — خطِّط للعودة في نفس الوقت من الموسم القادم.',
            order: 1
          },
          {
            id: 'rate',
            title_en: 'Rate your Kiwi Flavor experience',
            title_ar: 'قيِّم تجربتك مع نكهة الكيوي',
            desc_en: 'Seasonal products benefit most from your feedback — let us know what you loved.',
            desc_ar: 'المنتجات الموسمية تستفيد أكثر من تعليقاتك — أخبرنا بما أحببته.',
            order: 2
          },
          {
            id: 'share',
            title_en: 'Share the seasonal discovery',
            title_ar: 'شارك الاكتشاف الموسمي',
            desc_en: 'Help others find Kiwi Flavor before the season ends — tag @BerryPure on social.',
            desc_ar: 'ساعد الآخرين في إيجاد نكهة الكيوي قبل انتهاء الموسم — ذكِّر @BerryPure على وسائل التواصل.',
            order: 3
          }
        ]
      }
    ]
  }

};

/* ================================================================
   END FFY_CHECKLIST_DATA
   ================================================================ */
