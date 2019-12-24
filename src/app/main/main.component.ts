import { Component, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { TextService } from '../text.service'
import { HttpClient } from '@angular/common/http';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  //Allows innerHTML to accept classes
  encapsulation: ViewEncapsulation.None,
})

export class MainComponent implements OnInit {
  textContents: string;
  paragraphNumber: number;
  paragraphs: string[];
  selectedText: string = '';
  serverData: any;
  backgroundcolor = "#f18973"

  constructor(private httpClient: HttpClient) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.nextParagraph();
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.prevParagraph();
    }
  }

  ngOnInit() {
    this.paragraphNumber = 0;
    this.textContents = "No Text Detected, navigate to bookshare and fetch the text using the chrome extension."
    this.httpClient.get('http://127.0.0.1:5002/').subscribe(data => {
      console.log("Data Recieved..");
      console.log(data);
      this.serverData = data as JSON;
      this.textContents = this.serverData.books[0].content
      //Removes weird / from dialogue texts
      this.textContents = this.textContents.replace(/\\/g, "");


      this.paragraphs = this.textContents.split("<p>");
      this.paragraphs.forEach(function(str, index) {
          str = str.replace("</p>", "");
          str = str.replace("<p>", "");
          str = str.replace("<h1>", "");
          str = str.replace("</h1>", "");
          this[index] = str;
        }, this.paragraphs
      );


       // Skip to text and update selected text with current paragraph.
      while (this.validParagraph() 
        && this.paragraphs[this.paragraphNumber].includes("Chapter") 
        && this.paragraphNumber < this.paragraphs.length - 1) {
        this.paragraphNumber++;
      }
      this.selectedText = this.paragraphs[this.paragraphNumber];
    });
  }

  nextParagraph() {
    if (this.paragraphNumber < this.paragraphs.length - 1) {
      this.paragraphNumber++;
      this.updateDisplayedText();
    } else {
      console.log("End of book hit.");
    }
  }

  prevParagraph() {
    if (this.paragraphNumber != 0) {
      --this.paragraphNumber;
      this.skipIrrelevantParagraphAndUpdate();
    } else {
      console.log("Beginning of book hit.");
    }
  }


  skipIrrelevantParagraphAndUpdate() {
    while (this.validParagraph() 
      && this.paragraphs[this.paragraphNumber].includes("Chapter") 
      && this.paragraphNumber < this.paragraphs.length - 1) {
      this.paragraphNumber++;
    }
    this.updateDisplayedText();
  }

  validParagraph() {
    return !(this.paragraphNumber < 0 
      || this.paragraphNumber >= this.paragraphs.length);
  }

  updateDisplayedText() {
    if (!this.validParagraph()) return false;
    this.selectedText = this.paragraphs[this.paragraphNumber];
  }


  reset() {
    this.paragraphNumber = 0;
    this.skipIrrelevantParagraphAndUpdate();
  }

  processText() {
    //Removes weird / from texts
    this.selectedText = this.selectedText.replace(/\\/g, "");
    //Removes >
    this.selectedText = this.selectedText.replace(/>/g, "");
  }

}
