import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/data.service';
import { environment } from 'src/environments/environment';
import {
  EmailChangeDialogComponent,
  PasswordChangeDialogComponent,
} from '../../dialog';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public imageSrc: any;
  public file: any;
  profileForm: FormGroup;
  public baseUrl = environment.baseUrl;
  constructor(
    private _fb: FormBuilder,
    private dialog: MatDialog,
    private dataServie: DataService,
    private sharedService: SharedService
  ) {
    this.profileForm = this._fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      image: [''],
    });
  }

  ngOnInit(): void {
    this.dataServie.getMe().subscribe((res: any) => {
      this.sharedService.setProfileImage(res.data.image);
      this.profileForm.controls['fullname'].patchValue(res.data.name);
      this.profileForm.controls['email'].patchValue(res.data.email);
      if (res.data.image) {
        this.imageSrc = this.baseUrl + '/' + res.data.image;
      }
    });
  }

  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.file = fileList[0];
      this.profileForm.patchValue({
        photo: this.file,
      });
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(this.file);

      // this.renderer.setStyle(Elemen)
      // console.log('FileUpload -> files', fileList);
    }
  }

  get email() {
    return this.profileForm.value['email'];
  }

  get name() {
    return this.profileForm.value['fullname'];
  }


  saveDetails() {
    let formData = new FormData();
    let data: any = {};
    let isFormData = false;

    // Check if file is defined before appending it to formData
    if (this.file) {
      formData.append('image', this.file);
      isFormData = true;
    }

    // Append name if it is defined and not empty
    if (this.name && this.name.trim()) {
      if (isFormData) {
        formData.append('name', this.name.trim());
      } else {
        data.name = this.name.trim();
      }
    }

    // Append email if it is defined and valid
    if (this.email && this.validateEmail(this.email)) {
      if (isFormData) {
        formData.append('email', this.email);
      } else {
        data.email = this.email;
      }
    }

    // Handle imageSrc if it is defined and baseUrl is defined
    if (!isFormData && this.imageSrc && this.baseUrl) {
      let image = this.imageSrc.split(`${this.baseUrl}/`);
      if (image[1]) {
        data.image = image[1];
      } else {
        console.error("Failed to split imageSrc: resulting path is undefined");
        this.showToast('error', 'Unable to update details: Invalid image path');
        return;
      }
    }

    // Choose the correct update method based on whether formData is used
    const updateObservable = isFormData
      ? this.dataServie.updateUserDetail(formData)
      : this.dataServie.updateUserDetail(data);

    // Subscribe to the update observable and handle responses
    updateObservable.subscribe(
      (res: any) => {
        if (res.data.image) {
          this.sharedService.setProfileImage(res.data.image);
        }
        this.showToast('success', 'Detail Updated successfully');
      },
      ({ error }) => {
        console.error("Error updating details:", error);
        this.showToast('error', `${error.message}`);
      }
    );
  }

  validateEmail(email: string): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.[^<>()[\]\.,;:\s@"]{2,})|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(\[?[A-Fa-f0-9]*:[A-Fa-f0-9:]+\]?))$/;
    return re.test(String(email).toLowerCase());
  }

  showToast(icon: 'success' | 'error', title: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: icon,
      title: title,
    });
  }


  openPassworChangeDialog() {
    let dialogRef = this.dialog.open(PasswordChangeDialogComponent, {
      width: '50%',
      height: 'auto',
      backdropClass: 'bgClass',
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log('closed password dialog', result);
    });
  }
}
