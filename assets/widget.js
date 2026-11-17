(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sizeWidgetForm');
    if (!form) return;

    const categoryEl = document.getElementById('calc-category');
    const heightEl = document.getElementById('calc-height');
    const weightEl = document.getElementById('calc-weight');
    const girthEl = document.getElementById('calc-girth');
    const anatomyEl = document.getElementById('calc-anatomy');
    const resetBtn = document.getElementById('calc-reset');

    const labelGirth = document.getElementById('label-girth');
    const labelAnatomy = document.getElementById('label-anatomy');

    const errorHeight = document.getElementById('error-height');
    const errorWeight = document.getElementById('error-weight');
    const errorGirth = document.getElementById('error-girth');

    const resultStatus = document.getElementById('result-status');
    const resultSize = document.getElementById('result-size');
    const metric1Label = document.getElementById('metric-1-label');
    const metric1Val = document.getElementById('metric-1-val');
    const metric2Label = document.getElementById('metric-2-label');
    const metric2Val = document.getElementById('metric-2-val');
    const metric3Label = document.getElementById('metric-3-label');
    const metric3Val = document.getElementById('metric-3-val');
    const resultAdvice = document.getElementById('result-advice');

    const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const JEANS_WAIST_MALE = [28, 30, 31, 32, 34, 36];
    const JEANS_WAIST_FEMALE = [25, 26, 28, 30, 32, 34];

    function getSelectedGender() {
      const genderInput = form.querySelector('input[name="calc-gender"]:checked');
      return genderInput ? genderInput.value : 'male';
    }

    function validateNumberInput(input, errorEl, min, max, unit) {
      const raw = input.value.trim();
      input.classList.remove('border-red-500', 'border-[#111111]');

      if (raw === '') {
        showFieldError(input, errorEl, 'Поле не може бути порожнім');
        return null;
      }

      const num = Number(raw);

      if (!Number.isFinite(num) || Number.isNaN(num)) {
        showFieldError(input, errorEl, 'Введіть коректне число');
        return null;
      }

      if (!Number.isInteger(num)) {
        showFieldError(input, errorEl, 'Введіть ціле число (без дробів)');
        return null;
      }

      if (num < min || num > max) {
        showFieldError(input, errorEl, `Допустимо від ${min} до ${max} ${unit}`);
        return null;
      }

      input.classList.add('border-[#111111]');
      input.setAttribute('aria-invalid', 'false');
      errorEl.classList.add('hidden');
      return num;
    }

    function showFieldError(input, errorEl, message) {
      input.classList.add('border-red-500');
      input.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
      errorEl.classList.remove('hidden');
    }

    // Оновлення підписів полів залежно від статі та типу одягу
    function updateCategoryUI() {
      const isJeans = categoryEl.value === 'jeans';
      const isFemale = getSelectedGender() === 'female';

      if (isJeans) {
        labelGirth.textContent = 'Талія (60–130) *';
        girthEl.min = '60';
        girthEl.max = '130';
        if (Number(girthEl.value) === 98) girthEl.value = isFemale ? '68' : '82';

        labelAnatomy.textContent = isFemale
          ? 'Ширші стегна / комфортний запас у бедрах'
          : 'Атлетичні стегна / вільніша посадка в бедрах';

        metric1Label.textContent = 'Напівобхват талії';
        metric2Label.textContent = 'Зовнішній шов';
        metric3Label.textContent = 'Внутрішній шов';
      } else {
        labelGirth.textContent = 'Груди (70–145) *';
        girthEl.min = '70';
        girthEl.max = '145';
        if (Number(girthEl.value) === 82 || Number(girthEl.value) === 68) {
          girthEl.value = isFemale ? '88' : '98';
        }

        labelAnatomy.textContent = isFemale
          ? 'Ширші плечі або пишний бюст (додати запас у грудях)'
          : 'Широкі плечі / атлетична статура (додати запас у плечах)';

        metric1Label.textContent = 'Ширина грудей';
        metric2Label.textContent = 'Довжина спини';
        metric3Label.textContent = 'Довжина рукава';
      }
    }

    function calculateSize() {
      const category = categoryEl.value;
      const gender = getSelectedGender();
      const isFemale = gender === 'female';
      const isJeans = category === 'jeans';

      const girthMin = isJeans ? 60 : 70;
      const girthMax = isJeans ? 130 : 145;

      const height = validateNumberInput(heightEl, errorHeight, 140, 225, 'см');
      const weight = validateNumberInput(weightEl, errorWeight, 40, 160, 'кг');
      const girth = validateNumberInput(girthEl, errorGirth, girthMin, girthMax, 'см');

      if (height === null || weight === null || girth === null) {
        resultStatus.textContent = 'Очікування коректних даних';
        resultSize.textContent = '—';
        metric1Val.textContent = '— см';
        metric2Val.textContent = '— см';
        metric3Val.textContent = '— см';
        resultAdvice.textContent = 'Виправте підсвічені поля вище для точного розрахунку лекал.';
        return;
      }

      const fitInput = form.querySelector('input[name="calc-fit"]:checked');
      const fit = fitInput ? fitInput.value : 'regular';
      const hasAnatomyFeature = anatomyEl.checked;

      let sizeIndex = 2; // M за замовчуванням

      if (isJeans) {
        if (isFemale) {
          if (girth < 64) sizeIndex = 0;
          else if (girth < 69) sizeIndex = 1;
          else if (girth < 74) sizeIndex = 2;
          else if (girth < 80) sizeIndex = 3;
          else if (girth < 88) sizeIndex = 4;
          else sizeIndex = 5;

          if (weight > 78 && sizeIndex < 4) sizeIndex += 1;
        } else {
          if (girth < 74) sizeIndex = 0;
          else if (girth < 80) sizeIndex = 1;
          else if (girth < 86) sizeIndex = 2;
          else if (girth < 92) sizeIndex = 3;
          else if (girth < 100) sizeIndex = 4;
          else sizeIndex = 5;

          if (weight > 95 && sizeIndex < 4) sizeIndex += 1;
        }
      } else {
        if (isFemale) {
          if (girth < 82) sizeIndex = 0;
          else if (girth < 88) sizeIndex = 1;
          else if (girth < 94) sizeIndex = 2;
          else if (girth < 100) sizeIndex = 3;
          else if (girth < 108) sizeIndex = 4;
          else sizeIndex = 5;

          if (height >= 178 && sizeIndex < 3) sizeIndex += 1;
          if (weight >= 75 && sizeIndex < 4) sizeIndex += 1;
        } else {
          if (girth < 86) sizeIndex = 0;
          else if (girth < 94) sizeIndex = 1;
          else if (girth < 100) sizeIndex = 2;
          else if (girth < 106) sizeIndex = 3;
          else if (girth < 114) sizeIndex = 4;
          else sizeIndex = 5;

          if (height >= 188 && sizeIndex < 3) sizeIndex += 1;
          if (weight >= 92 && sizeIndex < 4) sizeIndex += 1;
        }
      }

      if (fit === 'slim') sizeIndex -= 1;
      if (fit === 'oversize') sizeIndex += 1;
      if (hasAnatomyFeature) sizeIndex += 1;

      sizeIndex = Math.max(0, Math.min(SIZES.length - 1, sizeIndex));
      const finalSize = SIZES[sizeIndex];

      resultStatus.textContent = isFemale
        ? 'Рекомендований розмір (Жіночий)'
        : 'Рекомендований розмір (Чоловічий)';

      if (isJeans) {
        const w = isFemale ? JEANS_WAIST_FEMALE[sizeIndex] : JEANS_WAIST_MALE[sizeIndex];
        const l = isFemale
          ? (height < 164 ? 28 : height <= 175 ? 30 : 32)
          : (height < 172 ? 30 : height <= 185 ? 32 : 34);

        const halfWaist = Math.round(w * 1.27 + (fit === 'oversize' ? 2 : 0));
        const outseam = Math.round(height * (isFemale ? 0.575 : 0.585));
        const inseam = Math.round(height * (isFemale ? 0.445 : 0.45));

        resultSize.textContent = `${finalSize} (W${w} / L${l})`;
        metric1Val.textContent = `${halfWaist} см`;
        metric2Val.textContent = `${outseam} см`;
        metric3Val.textContent = `${inseam} см`;
        resultAdvice.textContent = `${isFemale ? 'Жіночі' : 'Чоловічі'} джинси / штани для зросту ${height} см та талії ${girth} см (посадка ${fit.toUpperCase()}). Оптимальна довжина штанини L${l}.`;
      } else {
        const baseEase = category === 'hoodie' ? 8 : category === 'sweatshirt' ? 6 : 4;
        const ease = isFemale ? baseEase - 1 : baseEase;
        const chestWidth = Math.round(girth / 2 + ease + sizeIndex * 1.5);
        const backLength = Math.round(height * (isFemale ? 0.365 : 0.385) + sizeIndex * 1.1);
        const sleeveLength = category === 'tshirt'
          ? Math.round(height * (isFemale ? 0.115 : 0.125) + sizeIndex * 0.5)
          : Math.round(height * (isFemale ? 0.34 : 0.355) + sizeIndex * 0.8);

        const names = {
          tshirt: isFemale ? 'жіночої футболки' : 'чоловічої футболки',
          hoodie: isFemale ? 'жіночого худі' : 'чоловічого худі',
          sweatshirt: isFemale ? 'жіночого світшота' : 'чоловічого світшота'
        };

        resultSize.textContent = finalSize;
        metric1Val.textContent = `${chestWidth} см`;
        metric2Val.textContent = `${backLength} см`;
        metric3Val.textContent = `${sleeveLength} см`;
        resultAdvice.textContent = `Оптимальний баланс по плечах та довжині для ${names[category]} (${height} см / ${weight} кг, посадка ${fit.toUpperCase()}).`;
      }
    }

    // Перемикання статі
    form.querySelectorAll('input[name="calc-gender"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        const isFemale = radio.value === 'female';
        // Автопідстановка типових стартових значень, якщо користувач ще не вводив свої
        if (isFemale && Number(heightEl.value) === 180 && Number(weightEl.value) === 75) {
          heightEl.value = '168';
          weightEl.value = '56';
          girthEl.value = categoryEl.value === 'jeans' ? '68' : '88';
        } else if (!isFemale && Number(heightEl.value) === 168 && Number(weightEl.value) === 56) {
          heightEl.value = '180';
          weightEl.value = '75';
          girthEl.value = categoryEl.value === 'jeans' ? '82' : '98';
        }
        updateCategoryUI();
        calculateSize();
      });
    });

    // Перемикання категорії
    categoryEl.addEventListener('change', () => {
      updateCategoryUI();
      calculateSize();
    });

    // Введення числових параметрів у реальному часі
    [heightEl, weightEl, girthEl].forEach((input) => {
      input.addEventListener('input', calculateSize);
    });

    // Перемикання посадки
    form.querySelectorAll('input[name="calc-fit"]').forEach((radio) => {
      radio.addEventListener('change', calculateSize);
    });

    // Особливості фігури
    anatomyEl.addEventListener('change', calculateSize);

    // Скидання параметрів
    resetBtn.addEventListener('click', () => {
      form.querySelector('input[name="calc-gender"][value="male"]').checked = true;
      categoryEl.value = 'tshirt';
      heightEl.value = '180';
      weightEl.value = '75';
      girthEl.value = '98';
      form.querySelector('input[name="calc-fit"][value="regular"]').checked = true;
      anatomyEl.checked = false;
      updateCategoryUI();
      calculateSize();
    });

    form.addEventListener('submit', (e) => e.preventDefault());

    updateCategoryUI();
    calculateSize();
  });
})();