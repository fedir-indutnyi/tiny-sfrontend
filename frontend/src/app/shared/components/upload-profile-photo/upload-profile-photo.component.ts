import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FilesControllerService } from '../../sdk';
import { convertPlaceholderPathToUrl } from '../../../utils/dynamic-path';
import { lastValueFrom } from 'rxjs';

const FALLBACK_IMAGE = '/assets/images/no-avatar.png';

interface PathDataInteface {
  absolutePath: string;
}

@Component({
  selector: 'upload-profile-photo',
  templateUrl: './upload-profile-photo.component.html',
  styleUrls: ['./upload-profile-photo.component.scss']
})
export class UploadProfilePhotoComponent implements OnInit {
  userPictrue: string;
  @Input() photoPath: string;
  @Output() onPhotoChangeEvent = new EventEmitter<PathDataInteface>();

  constructor(private uploadService: FilesControllerService) { }

  ngOnInit(): void {
    this.userPictrue = convertPlaceholderPathToUrl(this.photoPath) || FALLBACK_IMAGE;
  }

  async onFileChange(e) {
    const input: HTMLInputElement = e.target;
    const file: File = input.files[0];
    const filData = await lastValueFrom(this.uploadService.filesControllerUpload(file));
    this.userPictrue = convertPlaceholderPathToUrl(filData.path);
    this.emitImagePath({ absolutePath: this.userPictrue });
  }

  clearProfilePhoto() {
    this.userPictrue = FALLBACK_IMAGE;
    this.emitImagePath({ absolutePath: "" });
  }

  private emitImagePath(data: PathDataInteface): void {
    this.onPhotoChangeEvent.emit(data)
  }
}
