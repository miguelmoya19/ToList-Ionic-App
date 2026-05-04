import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { DatabaseServiceCategory } from '../../services/dbCategory/database.service';
import { ICategoryDTO } from '../../model/dto/IcategoryDTO';
import { CategoryModalComponent } from '../category-modal/category-modal.component';

import { addIcons } from 'ionicons';
import { pricetag, add } from 'ionicons/icons';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CategoryListComponent implements OnInit {

  public categories: ICategoryDTO[] = [];

  constructor(private databaseServiceCategory: DatabaseServiceCategory, private modalCtrl: ModalController) {
    addIcons({ pricetag, add });
  }

  async openCategoryModal(category?: ICategoryDTO) {
    const modal = await this.modalCtrl.create({
      component: CategoryModalComponent,
      componentProps: { categoryData: category },
      initialBreakpoint: 0.65,
      breakpoints: [0, 0.65, 0.9],
      cssClass: 'custom-bottom-sheet'
    });

    modal.onDidDismiss().then(async () => {
      await this.getCategoryList();
    });

    return await modal.present();
  }

  async ngOnInit(): Promise<void> {
    await this.getCategoryList();
  }

  public async getCategoryList(): Promise<void> {
    this.categories = await this.databaseServiceCategory.getCategory();
  }
}