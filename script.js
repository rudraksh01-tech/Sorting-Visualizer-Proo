let arr = [];

function wait(ms = 600) {
  return new Promise(r => setTimeout(r, ms));
}

function generate() {
  arr = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90 + 10));
  draw();
  setLive("New array generated");
}

function setLive(t) {
  document.getElementById("live").innerText = t;
}

/* ================= DRAW ================= */
function draw(i = -1, j = -1, pivot = -1, sorted = []) {

  let g = document.getElementById("graph");
  let a = document.getElementById("array");

  g.innerHTML = "";
  a.innerHTML = "";

  arr.forEach((v, idx) => {

    // GRAPH
    let bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = v + "px";

    if (idx === i || idx === j) bar.style.background = "#ef4444";
    if (idx === pivot) bar.style.background = "#facc15";
    if (sorted.includes(idx)) bar.style.background = "#22c55e";

    g.appendChild(bar);

    // ARRAY BOX
    let box = document.createElement("div");
    box.className = "box";

    let ptr = "";
    if (idx === i) ptr = "i pointer ↓";
    if (idx === j) ptr = "j pointer ↓";
    if (idx === pivot) ptr = "pivot ↓";

    if (idx === i || idx === j) box.classList.add("active");
    if (sorted.includes(idx)) box.classList.add("sorted");
    if (idx === pivot) box.classList.add("pivot");

    box.innerHTML = `
      <div class="pointer">${ptr}</div>
      <div class="value">${v}</div>
    `;

    a.appendChild(box);
  });
}

/* ================= BUBBLE SORT ================= */
async function bubble() {

  for (let i = 0; i < arr.length; i++) {

    for (let j = 0; j < arr.length - i - 1; j++) {

      let sign = arr[j] > arr[j + 1] ? ">" : "<";

      draw(j, j + 1);
      setLive(`Comparing ${arr[j]} ${sign} ${arr[j + 1]}`);
      await wait();

      if (arr[j] > arr[j + 1]) {
        setLive(`Swap because ${arr[j]} > ${arr[j + 1]}`);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      } else {
        setLive(`No swap because ${arr[j]} < ${arr[j + 1]}`);
      }

      await wait();
    }
  }

  draw(-1, -1, -1, [...Array(arr.length).keys()]);
  setLive("Bubble Sort Completed ✔");
}

/* ================= MERGE SORT ================= */
async function merge(l, r) {

  if (l >= r) return;

  let m = Math.floor((l + r) / 2);

  await merge(l, m);
  await merge(m + 1, r);

  let temp = [];
  let i = l, j = m + 1;

  while (i <= m && j <= r) {

    draw(i, j);
    setLive(`Comparing ${arr[i]} and ${arr[j]}`);
    await wait();

    if (arr[i] < arr[j]) temp.push(arr[i++]);
    else temp.push(arr[j++]);
  }

  while (i <= m) temp.push(arr[i++]);
  while (j <= r) temp.push(arr[j++]);

  for (let k = l; k <= r; k++) {
    arr[k] = temp[k - l];
    draw(k);
    await wait();
  }
}

/* ================= QUICK SORT ================= */
async function quick(l, r) {

  if (l >= r) return;

  let pivot = arr[r];
  let i = l;

  setLive(`Pivot selected = ${pivot}`);

  for (let j = l; j < r; j++) {

    draw(j, r, r);
    setLive(`Compare ${arr[j]} with pivot ${pivot}`);
    await wait();

    if (arr[j] < pivot) {
      setLive(`${arr[j]} < pivot → move left`);
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    } else {
      setLive(`${arr[j]} > pivot → stay right`);
    }
  }

  [arr[i], arr[r]] = [arr[r], arr[i]];

  await quick(l, i - 1);
  await quick(i + 1, r);
}

/* ================= START ================= */
async function start() {

  let algo = document.getElementById("algo").value;

  if (algo === "bubble") await bubble();
  if (algo === "merge") await merge(0, arr.length - 1);
  if (algo === "quick") await quick(0, arr.length - 1);

  setLive("Sorting Completed ✔");
}

generate();