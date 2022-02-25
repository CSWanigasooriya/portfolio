import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinalRoutingModule } from './final-routing.module';
import { FinalComponent } from './final.component';

@NgModule({
  declarations: [FinalComponent],
  imports: [CommonModule, FinalRoutingModule],
  exports: [FinalComponent],
})
export class FinalModule {}
