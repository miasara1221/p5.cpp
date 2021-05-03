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

typedef TCHAR tchar_t;
typedef std::basic_string<tchar_t> tstring;

struct PImage
{
	ID2D1Bitmap* bitmap;
	int width, height;
	unsigned char* pixels;
};

struct PFont
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
	extern ID2D1SolidColorBrush* g_pBrush;

	int main(const HINSTANCE hInstance, const HINSTANCE hPrevInstance, const LPTSTR lpCmdLine, const int nCmdShow);
	void swapBuffer(void);

	extern void (*g_pfnPreload)(void);
	extern void (*g_pfnSetup)(void);
	extern void (*g_pfnDraw)(void);
#endif

extern P5_DLL int renderer;
extern P5_DLL int width, height;
extern P5_DLL int mouseX, mouseY;
extern P5_DLL bool mouseIsPressed;
extern P5_DLL int mouseButton;
extern P5_DLL bool keyIsPressed;
extern P5_DLL int keyCode;

P5_DLL void attachPreloadCallback(void (*function)(void));
P5_DLL void attachSetupCallback(void (*function)(void));
P5_DLL void attachDrawCallback(void (*function)(void));
P5_DLL int run(const HINSTANCE hInstance, const HINSTANCE hPrevInstance, const LPTSTR lpCmdLine, const int nCmdShow);

P5_DLL float millis(void);

P5_DLL void print(tstring str);

P5_DLL bool createCanvas(const unsigned int w, const unsigned int h, const int renderer);

P5_DLL void background(const unsigned char r, const unsigned char g, const unsigned char b);

P5_DLL PImage* loadImage(const tstring pFilename);
P5_DLL void image(const PImage* img, const float x, const float y, const float w, const float h);

P5_DLL PFont* loadFont(const tstring fontName);
P5_DLL void textFont(PFont* font);

P5_DLL void text(const tstring str, const float x, const float y);
