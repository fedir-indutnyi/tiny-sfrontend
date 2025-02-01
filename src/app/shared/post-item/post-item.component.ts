import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {convertPlaceholderPathToUrl} from '../../utils/dynamic-path';
import {IdeastartuplistWithRelations, UserteamrelationWithRelations} from "../sdk";

@Component({
  selector: 'post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})

export class PostItemComponent implements OnInit {
  fallbackImage: string = '/assets/images/no-avatar.png';
  postUserPicture: string;
  toggle: boolean = false;
  sharedTeamName: string;
  @Input() isSingleElement: boolean = false;
  @Input() postData: IdeastartuplistWithRelations;
  @Input() teams: UserteamrelationWithRelations[];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.toggle = this.postData?.ideadescription?.length > 3000;
    this.initializeSharedTeam();
  }

  private initializeSharedTeam(): void {
    const team = this?.teams?.find(value => value.teamId === this.postData.sharedteams);
    this.sharedTeamName = team?.team ? team.team.teamname : 
                         team ? 'Team id: ' + this.postData.sharedteams : null;
  }

  getVisibilityIcon(): string {
    if (this.postData?.ispublic) return 'global';
    if (this.postData?.sharedteams > 0) return 'team';
    return 'lock';
  }

  getVisibilityColor(): string {
    if (this.postData?.ispublic) return 'green';
    if (this.postData?.sharedteams > 0) return 'blue';
    return 'default';
  }

  getVisibilityText(): string {
    if (this.postData?.ispublic) return 'Public';
    if (this.postData?.sharedteams > 0) return 'Shared';
    return 'Private';
  }

  showMore(): void {
    this.toggle = false;
  }

  showLess(): void {
    this.toggle = true;
  }

  goToSingleComponent(): void {
    this.router.navigate([`/post/${this.postData.id}`]);
  }
  
  getDayFromDate(date: string): string {
    return date?.split('T')[0];
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  getUserAvatar(): string {
    return this.postData?.createdByProfile?.picture ? 
      convertPlaceholderPathToUrl(this.postData.createdByProfile.picture) : 
      this.fallbackImage;
  }

  handleAvatarError(event: any): void {
    event.target.src = this.fallbackImage;
  }

  handleClick(event: MouseEvent): void {
    if (this.isSingleElement) {
      event.preventDefault();
      return;
    }
    
    // If it's a left click, handle it with our router
    if (event.button === 0 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      this.goToSingleComponent();
    }
    // Otherwise (right click or ctrl/cmd+click) let the default behavior happen
  }

  hasImage(): boolean {
    return this.postData?.image && this.postData.recordtype !== 'businessplan';
  }
}
