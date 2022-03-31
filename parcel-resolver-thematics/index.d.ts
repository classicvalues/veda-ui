declare module 'delta/thematics' {
  import { MDXModule } from 'mdx/types';

  // ///////////////////////////////////////////////////////////////////////////
  //  Datasets                                                                //
  // ///////////////////////////////////////////////////////////////////////////
  type DatasetLayerType = 'raster' | 'vector';

  //
  // Dataset Layers
  //
  interface DatasetSourceParams {
    colormap_name?: string;
    rescale?: number[];
  }

  interface DatasetLayerCommonProps {
    zoomExtent?: number[];
    sourceParams?: DatasetSourceParams;
  }
  
  export type DatasetDatumFn<T> = (bag: DatasetDatumFnResolverBag) => T;
  export type DatasetDatumReturnType = Primitives | Date;
  interface DatasetLayerCommonCompareProps extends DatasetLayerCommonProps {
    datetime?: string | (DatasetDatumFn<DatasetDatumReturnType>);
    mapLabel?: string | (DatasetDatumFn<DatasetDatumReturnType>);
  }
  
  export interface DatasetLayerCompareSTAC extends DatasetLayerCommonCompareProps {
    stacCol: string;
    type: DatasetLayerType;
  }
  
  export interface DatasetLayerCompareInternal extends DatasetLayerCommonCompareProps {
    datasetId: string;
    layerId: string;
  }
  
  export interface DatasetLayer extends DatasetLayerCommonProps {
    id: string;
    name: string;
    description: string;
    type: DatasetLayerType;
    compare: DatasetLayerCompareSTAC | DatasetLayerCompareInternal;
    legend: LayerLegendCategorical | LayerLegendGradient
  }

  // A normalized compare layer is the result after the compare definition is
  // resolved from DatasetLayerCompareSTAC or DatasetLayerCompareInternal. The
  // difference with a "base" dataset layer is not having a name and
  // description.
  export interface DatasetLayerCompareNormalized extends DatasetLayerCommonCompareProps {
    id: string;
    type: DatasetLayerType;
  }

  // TODO: Complete once known
  export interface DatasetDatumFnResolverBag {
    [key: string]: any;
  }

  export interface LayerLegendGradient {
    type: 'gradient';
    min: string | number;
    max: string | number;
    stops: string[];
  }

  type CategoricalStop = { color: string; label: string; }

  export interface LayerLegendCategorical {
    type: 'categorical';
    stops: CategoricalStop[];
  }

  /**
   * Data structure for the Datasets frontmatter.
   */
  interface DatasetData {
    featured?: boolean;
    id: string;
    name: string;
    thematics: string[];
    description: string;
    media?: Media
    layers: DatasetLayer[];
  }

  // ///////////////////////////////////////////////////////////////////////////
  //  Discoveries                                                             //
  // ///////////////////////////////////////////////////////////////////////////

  /**
   * Data structure for the Discoveries frontmatter.
   */
  interface DiscoveryData {
    featured?: boolean;
    id: string;
    name: string;
    description: string;
    media?: Media
    thematics: string[];
  }

  // ///////////////////////////////////////////////////////////////////////////
  //  Thematic areas                                                          //
  // ///////////////////////////////////////////////////////////////////////////

  /**
   * Data structure for the Thematics frontmatter.
   */
   interface ThematicData {
    id: string;
    name: string;
    description: string;
    media?: Media
  }

  // ///////////////////////////////////////////////////////////////////////////
  //  General interfaces and types                                            //
  // ///////////////////////////////////////////////////////////////////////////
  type Primitives = string | number | boolean | null | undefined;

  interface Media {
    src: string;
    alt: string;
    author?: {
      name: string;
      url: string
    }
  }


  /**
   * Base structure for each of the data types in delta/thematics.
   */
   interface DeltaDatum<T> {
    [key: string]: {
      /**
       * Contains all the variables in the content's front matter.
       */
      data: T;
      /**
       * Promise to return the MDX content. Setup this way to allow dynamic
       * module loading.
       */
      content: Promise<MDXModule>;
    };
  }

  /**
   * Named exports: datasets.
   * Object with all the delta datasets keyed by the dataset id.
   */
  export const datasets: DeltaDatum<DatasetData>;

  /**
   * Named exports: discoveries.
   * Object with all the delta discoveries keyed by the discovery id.
   */
  export const discoveries: DeltaDatum<DiscoveryData>;

  /**
   * Named exports: thematics.
   * Object with all the delta thematics keyed by the thematic id.
   */
  export const thematics: DeltaDatum<ThematicData>;

  interface DeltaThematicListItem extends ThematicData {
    /**
     * Datasets that are related to this thematic area.
     */
    datasets: [DatasetData];
    /**
     * Discoveries that are related to this thematic area.
     */
    discoveries: [DiscoveryData];
  }

  /**
   * The default export is a list of all the thematic areas with their
   * respective datasets and discoveries. It contains no MDX content, just the
   * frontmatter data.
   */
  declare const _default: DeltaThematicListItem[];
  export default _default;
}