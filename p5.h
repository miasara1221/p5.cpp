/*
	p5.cpp, Version 0.5
	Copyright (c) 2021-04-05, SangGyu Gim
*/

#pragma once

#ifdef _P5_CPP
	#define P5_DLL __declspec(dllexport)
#else
	#include <windows.h>
	#include <d2d1.h>
	#include <tchar.h>
	#include <string>
#define P5_DLL __declspec(dllimport)
#endif

// typedef TCHAR tchar_t;
using tchar_t = TCHAR;
// typedef std::basic_string<tchar_t> tstring;
using tstring = std::basic_string<tchar_t>;

#ifdef _UNICODE
	#define _V(x) std::to_wstring(x)
#else
	#define _V(x) std::to_string(x)
#endif

struct _PImage
{
	ID2D1Bitmap* bitmap;
	float width, height;
	unsigned char* pixels;
};

struct _PFont
{
	IDWriteTextFormat* textFormat;
};

constexpr int GDI = 1;
constexpr int GDI_Plus = 2;
constexpr int D3D9_Surface = 3;
constexpr int Direct2D = 4;

constexpr int  LEFT = 1;
constexpr int  RIGHT = 2;
constexpr int  CENTER = 3;

constexpr int  LEFT_ARROW = 1;
constexpr int  RIGHT_ARROW = 2;
constexpr int  UP_ARROW = 3;
constexpr int  DOWN_ARROW = 4;

#ifdef _P5_CPP
	#define MAX_LOADSTRING 100
	extern HINSTANCE hInst;                                // 현재 인스턴스입니다.
	extern TCHAR szTitle[MAX_LOADSTRING];                  // 제목 표시줄 텍스트입니다.
	extern TCHAR szWindowClass[MAX_LOADSTRING];            // 기본 창 클래스 이름입니다.
	extern long long g_QPFrequency;
	extern long long g_QPCounter;
	extern HWND g_hWnd;
	extern ID2D1Factory* g_pD2DFactory;
	extern ID2D1HwndRenderTarget* g_pFrontBuffer;
	extern ID2D1BitmapRenderTarget* g_pBackBuffer;
	extern IDWriteFactory* g_pDWriteFactory;
	extern IDWriteTextFormat* g_pTextFormat;
	extern ID2D1SolidColorBrush* g_pColorBrush;
	//extern float deltaTime;

	int main(const HINSTANCE hInstance, const HINSTANCE hPrevInstance, const LPTSTR lpCmdLine, const int nCmdShow);
	void swapBuffer(void);

	//extern void (*g_pfnPreload)(void);
	extern void (*g_pfnSetup)(void);
	extern void (*g_pfnDraw)(void);
#endif

using PImage = _PImage*;
using PFont = _PFont*;

extern P5_DLL int renderer;
extern P5_DLL float width, height;
extern P5_DLL int mouseX, mouseY;
extern P5_DLL bool mouseIsPressed;
extern P5_DLL int mouseButton;
extern P5_DLL bool keyIsPressed;
extern P5_DLL int keyCode;
extern P5_DLL float deltaTime;

//P5_DLL void attachPreloadCallback(void (*function)(void));
P5_DLL void attachSetupCallback(void (*function)(void));
P5_DLL void attachDrawCallback(void (*function)(void));
P5_DLL int run(const HINSTANCE hInstance, const HINSTANCE hPrevInstance, const LPTSTR lpCmdLine, const int nCmdShow);

P5_DLL float millis(void);

P5_DLL void print(tstring str);

P5_DLL bool _createCanvas(float w, float h, int renderer, bool vsync);

P5_DLL void _background(unsigned char r, unsigned char g, unsigned char b);

P5_DLL PImage loadImage(tstring fileename);
//P5_DLL void image(PImage img, float x, float y, float w, float h);
P5_DLL void _image(PImage img, float dx, float dy, float dWidth, float dHeight, float sx, float sy, float sWidth, float sHeight);

P5_DLL PFont loadFont(const tstring fontName);
P5_DLL void textFont(PFont font);

P5_DLL void text(tstring str, float x, float y);

P5_DLL void _fill(unsigned char r, unsigned char g, unsigned char b, unsigned char a);
P5_DLL void noFill();

P5_DLL void _stroke(unsigned char r, unsigned char g, unsigned char b, unsigned char a);
P5_DLL void strokeWeight(float weight);
P5_DLL void noStroke();

P5_DLL void rect(float x, float y, float w, float h);
P5_DLL void ellipse(float x, float y, float w, float h);
P5_DLL void circle(float x, float y, float r);
P5_DLL void line(float x1, float y1, float x2, float y2);
P5_DLL void point(float x, float y);

inline bool createCanvas(float w, float h, int renderer = Direct2D, bool vsync = false) {
	return _createCanvas(w, h, renderer, vsync);
}

inline void background(unsigned char grayLevel) {
	_background(grayLevel, grayLevel, grayLevel);
}

inline void background(unsigned char r, unsigned char g, unsigned char b) {
	_background(r, g, b);
}

inline void image(PImage img, float x, float y) {
	_image(img, x, y, img->width, img->height, 0, 0, img->width, img->height);
}

inline void image(PImage img, float x, float y, float w, float h) {
	_image(img, x, y, w, h, 0, 0, img->width, img->height);
}

inline void image(PImage img, float dx, float dy, float dWidth, float dHeight, float sx, float sy, float sWidth, float sHeight) {
	_image(img, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight);
}

inline void fill(unsigned char r, unsigned char g, unsigned char b, unsigned char a = 255) {
	_fill(r, g, b, a);
}

inline void stroke(unsigned char r, unsigned char g, unsigned char b, unsigned char a = 255) {
	_stroke(r, g, b, a);
}

#ifndef _P5_CPP
void setup();
void draw();

int APIENTRY _tWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPTSTR lpCmdLine, int nCmdShow)
{
	// TODO: 여기에 코드를 입력합니다.
	attachSetupCallback(setup);
	attachDrawCallback(draw);
	return run(hInstance, hPrevInstance, lpCmdLine, nCmdShow);
}
#endif
