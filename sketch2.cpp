#include "p5.h"

constexpr float camW = 320;
constexpr float camH = 240;
constexpr float mapW = camW;
constexpr float mapH = 800 * 4;

void drawFPS() {
	fill(255, 255, 255);
	text(_V(1 / deltaTime) + _T(" fps"), 0, 0);
}

void drawBG(PImage img, float x, float y) {
	image(img, 0, 0, camW, camH, x, mapH - y, camW, camH);
}

void drawChar(float camX, float camY, PImage img, float x, float y, float w, float h) {
	image(img, camX + x, camY + (camH - y), w, h);
}

tstring filename = _T("assets\\SpaceShooterRedux\\PNG\\Enemies\\enemyBlack1.png");
PImage imgBG;
PImage imgEnemy;

void setup() {
	createCanvas(camW, camH);

	auto font = loadFont(_T("Gabriola"));
	textFont(font);

	imgBG = loadImage(_T("bg.png"));
	imgEnemy = loadImage(filename);
}

void draw() {
	static float camX = 0, camY = camH;
	static float ellapsedTime = 0;
	ellapsedTime += deltaTime;
	if (ellapsedTime > 1 / 60.0) {
		camY++;
		ellapsedTime = 0;
	}

	//background(0, 0, 0);

	drawBG(imgBG, camX, camY);

	drawChar(camX, camY, imgEnemy, 160, 1000, 40, 40);

	drawFPS();
}