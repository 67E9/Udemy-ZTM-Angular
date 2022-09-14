import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // private visible = false;
  modals: IModal[] = [];

  constructor() { }

  isModalOpen(id: string) : boolean{
    return !!this.modals.find(element => element.id === id)?.visible; 
    // ? stops evaluation at this point, if the element is undefined
    // !! converts the expression to a boolean (undefined will be false), alternative: wrap with Boolean()
  }

  toggleModal(id: string){
    const modal = this.modals.find(element => element.id === id)
    if (modal)
    {modal.visible = !modal?.visible}
  }

  register(id: string){
    this.modals.push({
      id: id,
      visible: false,
    })
  }

  unregister(id: string){
    this.modals = this.modals.filter(element => element.id !== id); //removes element with this id from array
  }
}
