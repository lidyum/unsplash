//modal açıkken resimleri sağa sola kaydırmak için kullanılacak
const big_image_urls = [];
let current_image_index = -1;
let max_image = 0;

//
//herhangi bir yerde şu tuşlara basılırsa yakala;
//ESC, ARROW_LEFT, ARROW_RIGHT
//
document.addEventListener("keyup", function (event) {
  const key = event.key;
  console.log(key);
  if (key == "Escape") {
    hide_modal();
  } else if (key == "ArrowLeft") {
    on_click_btn_left();
  } else if (key == "ArrowRight") {
    on_click_btn_right();
  }
});

//formdan submit gelirse yakala
const form = document.getElementById("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const is_valid = valid();
  if (is_valid) {
    get_images();
    hide_error();
  } else {
    render_error("Enter a topic");
    show_error();
    hide_result();
  }
});

/**
 * yazılan metne göre resimler getirir.
 */
function get_images() {
  const element = document.getElementById("topic");
  const topic = element.value;

  const params = {
    query: topic,
    client_id: "Je0UqxQNYCz-x9R1uVow91Z2O0kCGkyus6cbwacZ3Kk",
  };

  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");

  const url = `https://api.unsplash.com/search/photos?${query}`;

  show_spinner();
  disabled_form();
  hide_result();

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      render_results(data.results);
      show_result();
    })
    .finally(() => {
      const image_elements = document.querySelectorAll("#container_result img");

      image_elements.forEach((img) => {
        const big_image_url = img.big_image_url;
        img.addEventListener("click", () => {
          //basılan imageın index numarasını bulmamız lazım
          current_image_index = big_image_urls.findIndex(
            (item) => item == big_image_url
          );

          render_modal(big_image_url);
          show_modal();
        });
      });
      hide_spinner();
      enabled_form();
      focus();
    });
}

/**
 * modalın kapatma butonuna basılında tetiklenir
 */
function on_click_btn_close_modal() {
  hide_modal();
}

/**
 * modalın sola kaydırma butonuna basılında tetiklenir
 */
function on_click_btn_left() {
  if (current_image_index - 1 > -1) {
    current_image_index--;
    const big_image_url = big_image_urls[current_image_index];
    render_modal(big_image_url);
  }
}

/**
 * modalın sağa kaydırma butonuna basılında tetiklenir
 */
function on_click_btn_right() {
  if (current_image_index + 1 < max_image) {
    current_image_index++;
    const big_image_url = big_image_urls[current_image_index];
    render_modal(big_image_url);
  }
}

/**
 *
 * focus, text inputtayken, klavyeden bir tuşa basınca tetiklenir.
 * Kullanıcı birşeyler yazmaya başlayınca, ekranda kalan eski hata silinir.
 * [ENTER] harici tüm tuşlar ekranda ki hatayı siler
 */
function on_key_press_input(event) {
  const key_code = event.keyCode;

  if (key_code != 13) {
    hide_error();
  }
}

/**
 * formdaki tüm elementleri disable yapar
 */
function disabled_form() {
  const elements = document.getElementsByClassName("form-element");

  for (let i = 0; i < elements.length; i++) {
    elements[i].disabled = "disabled";
  }
}

/**
 * formdaki tüm elementleri enable yapar
 */
function enabled_form() {
  const elements = document.getElementsByClassName("form-element");

  for (let i = 0; i < elements.length; i++) {
    elements[i].disabled = "";
  }
}

/**
 *
 * kullanıcının inputa birşeyler girip girmediğini kontrol eder
 */
function valid() {
  const element = document.getElementById("topic");
  const value = element.value;

  if (value) {
    return true;
  } else {
    return false;
  }
}

function render_error(error_message) {
  const element = document.getElementById("error_message");
  element.innerText = error_message;
}

/**
 *
 * küçük resimlerden birine tıklayınca, büyük resmi göstermek için modal açılır
 * ekranın tam ortasında, arka planı siyah olarak açılır
 */
function render_modal(big_image_url) {
  const img_element = document.createElement("img");
  img_element.className = "big-image";
  img_element.src = big_image_url;

  const modal_element = document.getElementById("modal_content");
  modal_element.innerHTML = "";
  modal_element.appendChild(img_element);
}

function render_results(images) {
  const result_element = document.getElementById("container_result_content");
  result_element.innerHTML = "";

  if (images.length > 0) {
    max_image = images.length;
    current_image_index = -1;
    big_image_urls.splice(0);

    images.forEach((item) => {
      const item_element = document.createElement("div");

      const image_element = document.createElement("img");
      image_element.src = item.urls.small;
      image_element.big_image_url = item.urls.full;
      item_element.appendChild(image_element);

      result_element.appendChild(item_element);

      //sağa sola kaydırmalarda kullanılacak
      big_image_urls.push(item.urls.full);
    });
  } else {
    render_error("No result found");
    show_error();
  }
}

function focus() {
  const element = document.getElementById("topic");
  element.focus();
}

function show_error() {
  const element = document.getElementById("container_error");
  show_element(element);
}

function hide_error() {
  const element = document.getElementById("container_error");
  hide_element(element);
}

function show_spinner() {
  const element = document.getElementById("container_spinner");
  show_element(element);
}

function hide_spinner() {
  const element = document.getElementById("container_spinner");
  hide_element(element);
}

function hide_modal() {
  const element = document.getElementById("container_modal");
  hide_element(element);
}

function show_modal() {
  const element = document.getElementById("container_modal");
  show_element(element);
}

function hide_result() {
  const element = document.getElementById("container_result");
  hide_element(element);
}

function show_result() {
  const element = document.getElementById("container_result");
  show_element(element);
}

function show_element(element) {
  element.className = "show";
}

function hide_element(element) {
  element.className = "hide";
}
