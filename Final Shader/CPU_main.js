async function main() {
  init();
  await preload();
  setup();
  window.requestAnimationFrame(draw);
}

main();
