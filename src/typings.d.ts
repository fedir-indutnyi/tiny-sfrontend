/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

//declare var module: jbPivot;
interface JQuery {
  jbPivot(options?: any): any;
}
