import { LargeCoreStyles } from "@wrappid/core";

export class LargeModuleStyles extends LargeCoreStyles {
  constructor(){
    super();
    this.style = {
      /**************************************************
       * Using LargeUtilityStyles example
       *************************************************/
      testWrappidStyleClass: { ...this.styles.devBorder },
    };
  }
}
