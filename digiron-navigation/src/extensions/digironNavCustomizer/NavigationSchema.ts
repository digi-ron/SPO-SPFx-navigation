export interface NavigationObject {
    value: NavigationItem[];
}

//by making the items like this instead of having a bottom layer item, the render can be modified to go as many levels deep as you'd like
export interface NavigationItem {
    friendlyText: string;
	URL: string;
	iconRef: string;
	subItems: NavigationItem[];
}