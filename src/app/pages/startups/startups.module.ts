import { NgModule } from '@angular/core';
import { StartupsComponent } from './startups.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { routing } from './startups.routing';

@NgModule({
  imports: [
      CommonModule,
      SharedModule,
      routing
  ],
  declarations: [StartupsComponent]
})
export class StartupsModule {}
