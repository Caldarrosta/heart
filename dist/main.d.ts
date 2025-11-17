interface DataStruct {
    text: string;
    images: Array<{
        file: string;
        caption: string;
    }>;
}
declare const TYPING_SPEED = 20;
declare const HEART_FALL_COUNT = 100;
declare let data: DataStruct;
declare let greetingEl: HTMLElement;
declare let openGalleryBtn: HTMLElement;
declare let welcomeScreen: HTMLElement;
declare let galleryScreen: HTMLElement;
declare let galleryIndex: number;
declare let imageWrapper: HTMLElement;
declare let captionEl: HTMLElement;
declare let prevBtn: HTMLElement;
declare let nextBtn: HTMLElement;
declare let heartsLayer: HTMLElement;
declare function main(): Promise<void>;
declare function getData(): Promise<DataStruct>;
declare function typeText(text: string, onComplete: () => void): void;
declare function onTypingComplete(): void;
declare function showGallery(): void;
declare function showImage(i: number): void;
declare function addSwipeSupport(): void;
declare function launchHearts(n: number): void;
declare function createFallingHeart(index: number): void;
