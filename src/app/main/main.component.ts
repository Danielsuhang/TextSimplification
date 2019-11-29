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
  content: string;
  paragraphNumber: number;
  public query: string;
  selectedText: string = '';
  serverData: any;
  simplifiedText: string = '';
  chapterText: any[]
  backgroundcolor = "#f18973"

  constructor(private httpClient: HttpClient) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.nextPTag(true);
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.nextPTag(false);
    }

    if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.skipChap();
    }

    this.scroll('highlightText');
  }

  ngOnInit() {
    this.paragraphNumber = 0;
    this.textContents = "No Text Detected"
    this.httpClient.get('http://127.0.0.1:5002/').subscribe(data => {
      console.log("Data Recieved..");
      console.log(data);
      this.serverData = data as JSON;
      this.textContents = this.serverData.books[0].content
      //Removes weird / from dialogue texts
      this.textContents = this.textContents.replace(/\\/g, "");
    });
  }

  removeHighlightedText() {
    this.backgroundcolor = "#f18973"
    const arr = this.textContents.split(' #target class="highlightText"');

    //Trim last char of arr[0]
    this.textContents = arr.join('')
  }


  //Looks for the next paragraph text
  nextPTag(next: boolean) {
    //Immediately remove highlighted text
    this.removeHighlightedText()

    this.paragraphNumber = next
      ? this.paragraphNumber + 1 : this.paragraphNumber <= 1
        ? 1 : this.paragraphNumber - 1;
    var num = 0;
    //Cannot have an open tag that exists within 7 of end since </p> required
    for (var i = 0; i < this.textContents.length - 6; i++) {
      if (this.textContents.substring(i, i + 2) == "<p") {
        if (++num == this.paragraphNumber) {
          //Find closing tag
          for (var j = i + 3; j < this.textContents.length - 4; j++) {
            if (this.textContents.substring(j, j + 4) == "</p>") {
              this.selectedText = this.textContents.substring(i + 3, i + (j - i));

              /* Text Processing */
              //Removes weird / from texts
              this.selectedText = this.selectedText.replace(/\\/g, "");
              //Removes >
              this.selectedText = this.selectedText.replace(/>/g, "");

              //Add highlight feature 
              this.textContents = this.textContents.substring(0, i + 2) + ' #target class="highlightText"'
                + this.textContents.substring(i + 2, this.textContents.length);
              
              return this.textContents.substring(i + 3, i + (j - i));
            }
          }
          //If gotten to this body, no closing tag found
          console.log("No closing tag found")
          return "";
        }
      }
      //No more <paragraph> found
    }
    return "";
  }

  reset() {
    this.paragraphNumber = 0;
    this.nextPTag(true);
  }

  //ONLY A SEARCH, doesn't actually replace selectedText, Used for FindNextChap()
  findNextPTag() {
    //Cannot have an open tag that exists within 7 of end since </p> required
    this.removeHighlightedText()
    console.log(this.textContents.indexOf("#target class"))
    var paragraphCount = 0
    for (var i = 0; i < this.textContents.length - 6; i++) {
      if (this.textContents.substring(i, i + 2) == "<p") {
        paragraphCount++;
        //Find closing tag
        for (var j = i + 3; j < this.textContents.length - 4; j++) {
          if (this.textContents.substring(j, j + 4) == "</p>") {
            if (j - (i + 3) > 600) {
              this.selectedText = this.textContents.substring(i + 3, j)
              //Add highlight feature 
              this.paragraphNumber = paragraphCount;
              this.textContents = this.textContents.substring(0, i + 2) + ' #target class="highlightText"'
                + this.textContents.substring(i + 2, this.textContents.length);
              return new Array(this.textContents.substring(i + 3, i + (j - i)), paragraphCount + "");
            }
            else {
              break;
            }
          }
        }
        //If gotten to this body, no closing tag found
      }
      //No more <paragraph> found
    }
    console.log("No more paragraph tags left")
    return new Array();
  }
  //Scrolls the an element id on execution
  scroll(className: string): void {
    const elementList = document.querySelectorAll('.' + className);
    if (elementList.length > 0) {
      const element = elementList[0] as HTMLElement;
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  skipChap() {
    this.findNextPTag();
    this.scroll('highlightText');

  }

}
