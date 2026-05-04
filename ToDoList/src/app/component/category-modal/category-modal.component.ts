import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatabaseServiceCategory } from '../../services/dbCategory/database.service';
import { ICategoryDTO } from '../../model/dto/IcategoryDTO';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class CategoryModalComponent implements OnInit {

  @Input() categoryData?: ICategoryDTO;

  public categoryForm!: FormGroup;

  constructor(
    private readonly modalCtrl: ModalController,
    private readonly formBuilder: FormBuilder,
    private readonly databaseServiceCategory: DatabaseServiceCategory,
    private readonly alert: AlertService
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    if (this.categoryData) {
      this.categoryForm.patchValue({
        name: this.categoryData.name
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  public async saveCategory(): Promise<void> {
    const { name } = this.categoryForm.controls;

    if (this.categoryForm.valid) {
      if (this.categoryData) {
        // Update existing category
        await this.databaseServiceCategory.updteCategoryForId(this.categoryData.id, name.value);
        this.modalCtrl.dismiss({ categoryUpdated: true });
        this.alert.success('Categoría actualizada', 'La categoría fue actualizada con éxito');
      } else {
        // Create new category
        const newCategory: ICategoryDTO = {
          id: Date.now().toString(),
          name: name.value,
          value: 0,
          is_delete: false,
          created_at: new Date().toISOString()
        };
        await this.databaseServiceCategory.insertCategory(newCategory);
        this.modalCtrl.dismiss({ categoryAdded: true });
        this.alert.success('Categoría creada', 'La categoría fue guardada con éxito');
      }
    } else {
      this.alert.warning('Campo requerido', 'El nombre de la categoría es obligatorio');
    }
  }

  public async deleteCategory(): Promise<void> {
    if (this.categoryData) {
      await this.databaseServiceCategory.deleteCategory(this.categoryData.id);
      this.modalCtrl.dismiss({ categoryDeleted: true });
      this.alert.success('Categoría eliminada', 'La categoría fue eliminada');
    }
  }
}