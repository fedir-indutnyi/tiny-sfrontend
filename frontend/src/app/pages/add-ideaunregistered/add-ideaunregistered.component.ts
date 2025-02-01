import { Component } from '@angular/core';
import {IdeastartuplistControllerService} from '../../shared/sdk'

@Component({
  selector: 'add-dream',
  templateUrl: 'add-ideaunregistered.component.html',
  styleUrls: ['add-ideaunregistered.component.scss']

})
export class AddIdeaUnregisteredComponent {

  list = []

  constructor(
    private serviceIdea: IdeastartuplistControllerService,
  ) {

  }

  ngOnInit() {
  }


  submitNewIdeaOrdream(Ideatitle, IdeaDesscription){
    this.serviceIdea.ideastartuplistControllerCreate(
        {
          "ideatitle": Ideatitle,
          "ideadescription": IdeaDesscription
        },
    ).subscribe(
      submittedIdea => {
        console.log('submittedIdea :', submittedIdea);
        console.log("title: " + Ideatitle + ", Description: " + IdeaDesscription);
        alert("Idea Submitted");
            //this.router.navigateByUrl(this.returnUrl);
      },
      err => console.log('err :', err),
    );


  }

}

