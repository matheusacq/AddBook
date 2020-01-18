import { Component, OnInit, ViewChild } from '@angular/core';

import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonSlides, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides, { static: true }) public slides: IonSlides;
  public wavesPosition: number = 0;
  public wavesDifference: number = 100;
  public userLogin: User = {};
  public userRegister: User = {};
  private loading: any;


  constructor(
    public keyboard: Keyboard,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }
  segmentChanged(event: any) {
    if (event.detail.value === 'login') {
      this.slides.slidePrev();
      this.wavesPosition += this.wavesDifference;
    } else {
      this.slides.slideNext();
      this.wavesPosition -= this.wavesDifference;
    }
  }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);
    } catch (error) {
      //console.error(error);
      let message: string;

      switch (error.code) {
        case 'auth/user-not-found':
          message = 'Usuário não encontrado!';
          break;

        case 'auth/wrong-password':
          message = 'Senha incorreta!';
          break;

        case 'auth/argument-error':
          message = 'E-mail ou senha em branco!';
          break;

        case 'auth/invalid-email':
          message = 'E-mail inválido!';
          break;

        case 'auth/user-disabled':
          message = 'A conta do usuário foi desativada por um administrador.';
          break;
      }
      //this.presentToast(error.message);
      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }
  }

  async register() {
    await this.presentLoading();

    try {
      await this.authService.register(this.userRegister);
    } catch (error) {
      //console.error(error);
      let message: string;
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'E-mail já em uso!';
          break;
        case 'auth/invalid-email':
          message = 'E-mail inválido!';
          break;
        case 'auth/weak-password':
          message = 'A senha precisa conter ao menos 6 caracteres!';
          break;
        case 'auth/argument-error':
          message = 'Há campo(s) em branco!';
          break;
      }
      //this.presentToast(error.message);
      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Por favor, aguarde...' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }

  // async showForgetPassword() {
  //   let prompt = await this.alertCtrl.create({
  //     header: 'Digite seu e-mail',
  //     message: "Uma nova senha será enviada por e-mail",
  //     inputs: [
  //       {
  //         name: 'recoverEmail',
  //         placeholder: 'usuario@email.com'
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         handler: data => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Submit',
  //         handler: data => {
  //           let loading = this.loadingCtrl.create({
  //             message: 'Carregando...'
  //           });
  //           this.authService.resetPassword(data.recoverEmail).then(() => {
  //             //add toast
  //             this.loading.dismiss().then(() => {
  //               //show pop up
  //               let alert = this.alertCtrl.create({
  //                 header: 'Check your email',
  //                 subHeader: 'Password reset successful',
  //                 buttons: ['OK']
  //               });
  //               // alert.present();
  //             })

  //           }, error => {
  //             //show pop up
  //             this.loading.dismiss().then(() => {
  //               let alert = this.alertCtrl.create({
  //                 header: 'Error resetting password',
  //                 subHeader: error.message,
  //                 buttons: ['OK']
  //               });
  //               // alert.present();
  //             })


  //           });
  //         }
  //       }
  //     ]
  //   });
  //   prompt.present();
  // }


  async presentLoading2() {
    const loading = await this.loadingCtrl.create({
      message: 'Redefinindo sua senha...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  async showForgetPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Digite seu e-mail',
      message: 'Informe seu e-mail para que possamos te enviar um link de recuperação da senha',
      inputs: [
        {
          name: 'recoverEmail',
          type: 'email',
          placeholder: 'usuario@email.com'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Enviar',
          handler: data => {
            this.presentLoading2();
            this.authService.resetPassword(data.recoverEmail).then(() => {
              //add toast
              // this.loading.dismiss().then(() => {
              //show pop up
              // let alert = this.alertCtrl.create({
              //    header: 'Check your email',
              //    subHeader: 'Password reset successful',
              //    buttons: ['OK']
              // });
              // alert.present();
              // })

            }, error => {
              //show pop up
              //   this.loading.dismiss().then(() => {
              // let alert = this.alertCtrl.create({
              //   header: 'Error resetting password',
              //   subHeader: error.message,
              //   buttons: ['OK']
              // });
              //     alert.present();
              //   })
            });
          }
        }
      ]
    });
    await alert.present();
  }
}