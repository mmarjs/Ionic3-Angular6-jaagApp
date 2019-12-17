import { Component, Input } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'login-layout-1',
    templateUrl: 'login.html'
})
export class LoginLayout1 {
    @Input() data: any;
    @Input() events: any;

    public usernameLogin: string;
    public passwordLogin: string;
    private isUsernameValidLogin: boolean = true;
    private isPasswordValidLogin: boolean = true;

    public usernameRegister: string;
    public passwordRegister: string;
    public countryRegister: string;
    public cityRegister: string;
    public emailRegister: string;

    private isEmailValidRegister: boolean = true;
    private isUsernameValidRegister: boolean = true;
    private isPasswordValidRegister: boolean = true;
    private isCityValidRegister: boolean = true;
    private isCountryValidRegister: boolean = true;

    private regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    public selectedItem = "login";

    constructor() { }

    onEvent = (event: string): void => {
        if (event == "onLogin" ) {
            if (!this.validateLogin()) {
                return
            }
            if (this.events[event]) {
                this.events[event]({
                    'username' : this.usernameLogin,
                    'password' : this.passwordLogin
                });
            }
        } else if (event == "onRegister") {
            if (!this.validateRegister()) {
                return
            }
            if (this.events[event]) {
                this.events[event]({
                    'username': this.usernameRegister,
                    'password': this.passwordRegister,
                    'country': this.countryRegister,
                    'city': this.cityRegister,
                    'email': this.emailRegister
                });
            }
        }
      }

    validateLogin():boolean {
        this.isUsernameValidLogin = true;
        this.isPasswordValidLogin = true;

        if (!this.usernameLogin ||this.usernameLogin.length == 0) {
            this.isUsernameValidLogin = false;
        }

        if (!this.passwordLogin || this.passwordLogin.length == 0) {
            this.isPasswordValidLogin = false;
        }

        return this.isPasswordValidLogin && this.isUsernameValidLogin;
     }

     validateRegister():boolean {
        this.isEmailValidRegister = true;
        this.isUsernameValidRegister = true;
        this.isPasswordValidRegister = true;
        this.isCityValidRegister = true;
        this.isCountryValidRegister = true;

        if (!this.usernameRegister ||this.usernameRegister.length == 0) {
            this.isUsernameValidRegister = false;
        }

        if (!this.passwordRegister || this.passwordRegister.length == 0) {
            this.isPasswordValidRegister = false;
        }

        if (!this.passwordRegister || this.passwordRegister.length == 0) {
            this.isPasswordValidRegister = false;
        }

        if (!this.cityRegister || this.cityRegister.length == 0) {
            this.isCityValidRegister = false;
        }

        if (!this.countryRegister || this.countryRegister.length == 0) {
            this.isCountryValidRegister = false;
        }

        this.isEmailValidRegister = this.regex.test(this.emailRegister);

        return this.isEmailValidRegister &&
            this.isPasswordValidRegister &&
            this.isUsernameValidRegister &&
            this.isCityValidRegister &&
            this.isCountryValidRegister;
    }

     isEnabled(value:string): boolean {
        return this.selectedItem == value;
     }
}
