import { ReactNode } from 'react';
import { mergeWithoutArray } from '@/utils/tool';
import { DEFAULT_GROUP_CONFIG } from '@/utils/constants/screenData';
import { isGroupComponent } from '@/utils/Assist/Component';
// Chart
import BarBasic from './Chart/Bar/BarBasic';
import LineBasic from './Chart/Line/LineBasic';
import PieBasic from './Chart/Pie/PieBasic';
import ScatterBasic from './Chart/Scatter/ScatterBasic';
import RadarBasic from './Chart/Radar/RadarBasic';
import BoxPlotBasic from './Chart/BoxPlot/BoxPlotBasic';
import FunnelBasic from './Chart/Funnel/FunnelBasic';
import GaugeBasic from './Chart/Gauge/GaugeBasic';
import TreeMapBasic from './Chart/TreeMap/TreeMapBasic';
import SunBurstBasic from './Chart/SunBurst/SunBurstBasic';
import PictorialBarBasic from './Chart/PictorialBar/PictorialBarBasic';
import ParallelBasic from './Chart/Parallel/ParallelBasic';
import CandlestickBasic from './Chart/Candlestick/CandlestickBasic';
import RadialBar from './Chart/Bar/RadialBar';
import RadialLine from './Chart/Line/RadialLine';
import ProgressBar from './Chart/Bar/ProgressBar';
import NightingalePie from './Chart/Pie/NightingalePie';
import RadialStackLine from './Chart/Line/RadialStackLine';
import ClockGauge from './Chart/Gauge/ClockGauge';
import CirclePie from './Chart/Pie/CirclePie';
import HorizontalBar from './Chart/Bar/HorizontalBar';
import RankBar from './Chart/Bar/RankBar';
import CachetBar from './Chart/Bar/CachetBar';
import PercentPie from './Chart/Pie/PercentPie';
import StackBar from './Chart/Bar/StackBar';
import NegativeBar from './Chart/Bar/NegativeBar';
import PercentBar from './Chart/Bar/PercentBar';
import LineBar from './Chart/Bar/LineBar';
import ZebraBar from './Chart/Bar/ZebraBar';
import TreeBasic from './Chart/Tree/TreeBasic';
import WaterFallBar from './Chart/Bar/WaterFallBar';
import BubbleScatter from './Chart/Scatter/BubbleScatter';
import PolarBar from './Chart/Bar/PolarBar';
import StepLine from './Chart/Line/StepLine';
import PolarStackBar from './Chart/Bar/PolarStackBar';
// other
import WordCloud from './Other/WordCloud';
import Iframe from './Other/Iframe';
import List from './Other/List';
import WaterBall from './Other/WaterBall';
import StateCard from './Other/StateCard';
import StateList from './Other/StateList';
import Weather from './Other/Weather';
import PathBasic from './Other/PathBasic';
import QrCode from './Other/QrCode';
import LuckyDraw from './Other/LuckyDraw';
// font
import Title from './Font/Title';
import TimeMachine from './Font/TimeMachine';
import CountUpNumber from './Font/CountUpNumber';
import FontCarousel from './Font/FontCarousel';
import Text from './Font/Text';
import LoopText from './Font/LoopText';
import Icon from './Font/Icon';
import Tag from './Font/Tag';
// media
import Image from './Media/Image';
import Video from './Media/Video';
import Carousel from './Media/Carousel';
import PictureWall from './Media/PictureWall';
import Audio from './Media/Audio';
import Model from './Media/Model';
// interactive
import Tab from './Interactive/Tab';
import Select from './Interactive/Select';
import Steps from './Interactive/Steps';
import Switch from './Interactive/Switch';
import Input from './Interactive/Input';
import Checkbox from './Interactive/Checkbox';
import Radio from './Interactive/Radio';
import Datepicker from './Interactive/Datepicker';
import Rate from './Interactive/Rate';
import Button from './Interactive/Button';
import Pagination from './Interactive/Pagination';
// map
import ScatterMap from './Map/ScatterMap';
import Ali3DMap from './Map/Ali3DMap';
// source
import Ticket from './Source/Ticket';
import Typed from './Source/Typed';
import Decoration1 from './Source/Decoration1';
import Decoration2 from './Source/Decoration2';
import Decoration3 from './Source/Decoration3';
import Decoration4 from './Source/Decoration4';
import Decoration5 from './Source/Decoration5';
import Decoration6 from './Source/Decoration6';
import Decoration7 from './Source/Decoration7';
import Decoration8 from './Source/Decoration8';
// component-map-import-prefix

const COMPONENT_MAP = new Map<
  ComponentData.TComponentSelfType,
  {
    themeConfig: {
      convert: (colorList: string[], options: any) => any;
    };
    defaultConfig: () => object;
    configComponent: ReactNode;
    render: ReactNode;
  }
>();

COMPONENT_MAP.set(BarBasic.type, BarBasic);
COMPONENT_MAP.set(LineBasic.type, LineBasic);
COMPONENT_MAP.set(PieBasic.type, PieBasic);
COMPONENT_MAP.set(ScatterBasic.type, ScatterBasic);
COMPONENT_MAP.set(RadarBasic.type, RadarBasic);
COMPONENT_MAP.set(BoxPlotBasic.type, BoxPlotBasic);
COMPONENT_MAP.set(FunnelBasic.type, FunnelBasic);
COMPONENT_MAP.set(GaugeBasic.type, GaugeBasic);
COMPONENT_MAP.set(WordCloud.type, WordCloud);
COMPONENT_MAP.set(Title.type, Title);
COMPONENT_MAP.set(TimeMachine.type, TimeMachine);
COMPONENT_MAP.set(CountUpNumber.type, CountUpNumber);
COMPONENT_MAP.set(Image.type, Image);
COMPONENT_MAP.set(Carousel.type, Carousel);
COMPONENT_MAP.set(Iframe.type, Iframe);
COMPONENT_MAP.set(Tab.type, Tab);
COMPONENT_MAP.set(Select.type, Select);
COMPONENT_MAP.set(TreeMapBasic.type, TreeMapBasic);
COMPONENT_MAP.set(SunBurstBasic.type, SunBurstBasic);
COMPONENT_MAP.set(Video.type, Video);
COMPONENT_MAP.set(PictorialBarBasic.type, PictorialBarBasic);
COMPONENT_MAP.set(ParallelBasic.type, ParallelBasic);
COMPONENT_MAP.set(CandlestickBasic.type, CandlestickBasic);
COMPONENT_MAP.set(List.type, List);
COMPONENT_MAP.set(RadialBar.type, RadialBar);
COMPONENT_MAP.set(RadialLine.type, RadialLine);
COMPONENT_MAP.set(ProgressBar.type, ProgressBar);
COMPONENT_MAP.set(NightingalePie.type, NightingalePie);
COMPONENT_MAP.set(RadialStackLine.type, RadialStackLine);
COMPONENT_MAP.set(ClockGauge.type, ClockGauge);
COMPONENT_MAP.set(CirclePie.type, CirclePie);
COMPONENT_MAP.set(HorizontalBar.type, HorizontalBar);
COMPONENT_MAP.set(WaterBall.type, WaterBall);
COMPONENT_MAP.set(RankBar.type, RankBar);
COMPONENT_MAP.set(CachetBar.type, CachetBar);
COMPONENT_MAP.set(PercentPie.type, PercentPie);
COMPONENT_MAP.set(StackBar.type, StackBar);
COMPONENT_MAP.set(NegativeBar.type, NegativeBar);
COMPONENT_MAP.set(PercentBar.type, PercentBar);
COMPONENT_MAP.set(LineBar.type, LineBar);
COMPONENT_MAP.set(ScatterMap.type, ScatterMap);
COMPONENT_MAP.set(FontCarousel.type, FontCarousel);
COMPONENT_MAP.set(Text.type, Text);
COMPONENT_MAP.set(ZebraBar.type, ZebraBar);
COMPONENT_MAP.set(TreeBasic.type, TreeBasic);
COMPONENT_MAP.set(WaterFallBar.type, WaterFallBar);
COMPONENT_MAP.set(BubbleScatter.type, BubbleScatter);
COMPONENT_MAP.set(LoopText.type, LoopText);
COMPONENT_MAP.set(PictureWall.type, PictureWall);
COMPONENT_MAP.set(StateCard.type, StateCard);
COMPONENT_MAP.set(Icon.type, Icon);
COMPONENT_MAP.set(Steps.type, Steps);
COMPONENT_MAP.set(Switch.type, Switch);
COMPONENT_MAP.set(Input.type, Input);
COMPONENT_MAP.set(Checkbox.type, Checkbox);
COMPONENT_MAP.set(Radio.type, Radio);
COMPONENT_MAP.set(PolarBar.type, PolarBar);
COMPONENT_MAP.set(StepLine.type, StepLine);
COMPONENT_MAP.set(Datepicker.type, Datepicker);
COMPONENT_MAP.set(PolarStackBar.type, PolarStackBar);
COMPONENT_MAP.set(StateList.type, StateList);
COMPONENT_MAP.set(Rate.type, Rate);
COMPONENT_MAP.set(Tag.type, Tag);
COMPONENT_MAP.set(Weather.type, Weather);
COMPONENT_MAP.set(Audio.type, Audio);
COMPONENT_MAP.set(Model.type, Model);
COMPONENT_MAP.set(Ali3DMap.type, Ali3DMap);
COMPONENT_MAP.set(PathBasic.type, PathBasic);
COMPONENT_MAP.set(QrCode.type, QrCode);
COMPONENT_MAP.set(LuckyDraw.type, LuckyDraw);
COMPONENT_MAP.set(Ticket.type, Ticket);
COMPONENT_MAP.set(Button.type, Button);
COMPONENT_MAP.set(Typed.type, Typed);
COMPONENT_MAP.set(Decoration1.type, Decoration1);
COMPONENT_MAP.set(Decoration2.type, Decoration2);
COMPONENT_MAP.set(Decoration3.type, Decoration3);
COMPONENT_MAP.set(Decoration4.type, Decoration4);
COMPONENT_MAP.set(Decoration5.type, Decoration5);
COMPONENT_MAP.set(Decoration6.type, Decoration6);
COMPONENT_MAP.set(Decoration7.type, Decoration7);
COMPONENT_MAP.set(Decoration8.type, Decoration8);
COMPONENT_MAP.set(Pagination.type, Pagination);
// component-map-insert-prefix

export function getComponentByType(component: ComponentData.TComponentData) {
  return COMPONENT_MAP.get(component.componentType);
}

export function getComponentDefaultConfigByType(
  componentType: ComponentData.TComponentSelfType,
) {
  return COMPONENT_MAP.get(componentType)?.defaultConfig() || {};
}

export function getComponentThemeConfigByType(
  componentType: ComponentData.TComponentSelfType,
) {
  return COMPONENT_MAP.get(componentType)?.themeConfig || {};
}

export function getComponentRenderByType(
  componentType: ComponentData.TComponentSelfType,
) {
  return COMPONENT_MAP.get(componentType)?.render;
}

export function getComponentConfigComponentByType(
  componentType: ComponentData.TComponentSelfType,
) {
  return COMPONENT_MAP.get(componentType)?.configComponent;
}

export function mergeComponentDefaultConfig(
  components: ComponentData.TComponentData[] | ComponentData.TComponentData,
): ComponentData.TComponentData[] {
  const realComponents = Array.isArray(components) ? components : [components];
  return realComponents.map((component) => {
    const { componentType } = component;
    let defaultConfig: any;
    if (isGroupComponent(component)) {
      defaultConfig = {
        ...DEFAULT_GROUP_CONFIG,
      };
    } else {
      defaultConfig = getComponentDefaultConfigByType(componentType);
    }
    return mergeWithoutArray(
      {},
      {
        config: defaultConfig,
      },
      component,
      ...(component.components
        ? [
            {
              components: mergeComponentDefaultConfig(component.components),
            },
          ]
        : []),
    );
  });
}
