export type TListConfig = {
  global: {
    animation: {
      show: boolean;
      type: 'column' | 'page';
      internal: number;
      less: boolean;
    };
  };
  header: {
    show: boolean;
    height: number;
    backgroundColor: ComponentData.TColorConfig;
    textStyle: ComponentData.TFontConfig;
  };
  index: {
    show: boolean;
    backgroundColor: ComponentData.TColorConfig;
    width: number;
    radius: number;
    textStyle: ComponentData.TFontConfig;
  };
  columns: {
    margin: number;
    even: {
      backgroundColor: ComponentData.TColorConfig;
    };
    odd: {
      backgroundColor: ComponentData.TColorConfig;
    };
    data: {
      key: string;
      name: string;
      width: number;
      type: 'image' | 'text';
      textStyle: ComponentData.TFontConfig & {
        textAlign: 'left' | 'right' | 'center';
      };
      header: {
        textStyle?: ComponentData.TFontConfig;
        backgroundColor?: ComponentData.TColorConfig;
        show: boolean;
      };
    }[];
  };
};
