import { Component } from '@angular/core';

@Component({
    selector: 'app-keypad',
    templateUrl: './keypad.component.html',
    styleUrls: ['./keypad.component.scss']
})
export class KeypadComponent {

    constructor() { }

    keys: number[] = [
        1, 2, 3,
        4, 5, 6,
        7, 8, 9,
           0
    ];

    keyLit: boolean[] = Array(this.keys.length).fill(false);
    keyAnimated: boolean[] = Array(this.keys.length).fill(false);
    keyTimeout: any[] = Array(this.keys.length);

    password: number[] = [1, 3, 5, 7];
    passwordAttempt = Array(this.password.length);
    passwordCorrect: boolean = false;

    keyPressed(key: number | string) {
        let index = this.keys.indexOf(key as number);

        if (index == -1) return;

        this.inputKey(key);

        this.keyAnimated[index] = false;
        this.keyLit[index] = true;

        setTimeout(() => {
            this.keyAnimated[index] = true;
            this.keyLit[index] = false;

            clearTimeout(this.keyTimeout[index]);

            this.keyTimeout[index] = setTimeout(() => {
                this.keyAnimated[index] = false;
            }, 400);
        });
    }

    inputKey(key: number | string) {
        if (this.passwordCorrect) return;

        for (let i = 0; i < this.passwordAttempt.length - 1; i++) {
            this.passwordAttempt[i] = this.passwordAttempt[i + 1];
        }

        this.passwordAttempt[this.passwordAttempt.length - 1] = key as number;

        let success = true;

        for (let i = 0; i < this.password.length; i++) {
            if (this.passwordAttempt[i] != this.password[i]) {
                success = false;
                break;
            }
        }

        this.passwordCorrect = success;
    }
}