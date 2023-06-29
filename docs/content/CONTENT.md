📇 **Shortcuts:**

- Check the [MDX_BLOCK.md](./MDX_BLOCKS.md) for information on the different blocks that can be used to compose the content layout.
- Check [layer.md](./frontmatter/layer.md) for details on the different properties of a dataset layer.
- Check [media.md](./frontmatter/media.md) for information on the images needed for the content's covers.
- Check [TAXONOMY.md](./TAXONOMY.md) for information on the available taxonomies for content.

----

# Content

- [Content](#content)
  - [Datasets](#datasets)
  - [Discoveries](#discoveries)

Veda consists of Datasets, and Discoveries.
Each piece of content is written in [MDX](https://mdxjs.com/docs/what-is-mdx/#what-is-mdx) with configuration frontmatter. Frontmatter is separate by a set of `---` from MDX content.  

A file will look something like:
```yml
---
id: discovery1
name: Example discovery
---

<Block>
  <Prose>
    ## About this discovery

    Once upon a time there was a content string
  </Prose>
</Block>
```

There are different types of `Block` components that can be used to create engaging content pieces.  
Each `Block` comes with its own rules and needed props, so check the [MDX_BLOCK.md](./MDX_BLOCKS.md) for the full details.

---

## Datasets

Frontmatter configuration for the Dataset
```yaml
---
id: string
name: string
description: string
media: Media

thematics: string[]
sources: string[]
featured: boolean

layers: Layer[]
related: Related[]
  - type: string
    id: string
    thematic: string
usage: Usage[]
  - url: string
    label: string
    title: string
---

<Block>
  <Prose>
    ## This is a Dataset

    Once upon a time there was a content string
  </Prose>
</Block>
```

MDX content for datasets will show up on its own page under `/data-catalog/:dataset-id`. For example, `no2` dataset MDX will show up under `/data-catalog/no2`.

**id**  
`string`  
Id of this dataset. Must be unique in the whole application

**name**  
`string`  
Name of this dataset. This is used to reference to this dataset in the application.

**description**  
`string`  
Brief description of this dataset. This is displayed on cards and the header of a dataset.

**media**  
`Media`  
Image to identify this resource. See [media.md](./frontmatter/media.md).

**thematics**  
`string[]`  
List of thematic areas this dataset belongs to.  
Must be a list of ids as defined in the [taxonomies index file](./TAXONOMY.md).
Example:
```yaml
thematics:
  - covid-19
  - agriculture
```

**sources**  
`string[]`  
List of sources for this dataset.  
Must be a list of ids as defined in the [taxonomies index file](./TAXONOMY.md).
Example:
```yaml
sources:
  - devseed
```

**featured**  
`boolean`  
Whether this dataset is featured
![](./media/fm-featured-dataset.png)

**layers**  
`Layer[]`  
List of layers for this dataset. See [layer.md](./frontmatter/layer.md).  
Example:
```yaml
layers:
  - id: layerId
    ... # more props
  - id: anotherLayerId
    ... # more props
```

**related**  
`Related[]`  
List of related contents. This list will be displayed at the bottom of dataset overview like below.  
(The screenshot shows the case when there are 2 related content entries.)

![screenshot of related content component on the dashboard](./media/related-content-dataset.jpg)

Each content should be formatted like below. 

```yaml
  - type: dataset
    id: dataset-id
  - type: discovery
    id: discovery-id
```

**usage**  
`Usage[]`  
Links to examples for how to use this dataset.  
The usage information will be accessible from the header of a dataset page (via the _Analyze data (Python)_ button), from the explore page, and from any long form content through the use of the [NotebookConnectCallout](./MDX_BLOCKS.md#notebook-connect-callout).

![](./media/dataset-header.png)

**usage[].url**  
`string`  
URL for example on how to use this dataset.

**usage[].label**  
`string`  
A label for the type of interface this link opens. Currently, typical interfaces include a static notebook or a notebook hub.

**usage[].title**  
`string`  
Title of the page linked to for an example of how to use this dataset.  

Example:
```yaml
usage:
  - url: 'https://github.com/NASA-IMPACT'
    label: View example notebook
    title: 'Static view in VEDA documentation'
  - url: "https://nasa-veda.2i2c.cloud/"
    label: Run example notebook
    title: 'Interactive session in VEDA 2i2c JupyterHub (requires account)'
```

---

## Discoveries

Frontmatter configuration for the Discovery
```yaml
---
id: string
name: string
description: string
media: Media
pubDate: string

thematics: string[]
sources: string[]
featured: boolean

related: Related[]
  - type: string
    id: string
    thematic: string
---

<Block>
  <Prose>
    ## This is a discovery

    Once upon a time there was a content string
  </Prose>
</Block>
```

MDX content for discoveries will show up on its own page under `/discoveries/:discovery-id`. For example, `air-quality-and-covid-19` discovery MDX will show up under `/discoveries/air-quality-and-covid-19`.

**id**  
`string`  
Id of this discovery. Must be unique in the whole application.

**name**  
`string`  
Name of this discovery. This is used to reference to this discovery in the application.

**description**  
`string`  
Brief description of this discovery. This is displayed on cards and the header of a discovery.

**media**  
`Media`  
Image to identify this resource. See [media.md](./frontmatter/media.md).

**pubDate**  
`string`  
Publication date for this discovery. Should be in YYYY-MM-DD format.

**thematics**  
`string[]`  
List of thematic areas this discovery belongs to.
Must be a list of ids as defined in the [taxonomies index file](./TAXONOMY.md).
Example:
```yaml
thematics:
  - covid-19
  - agriculture
```

**sources**  
`string[]`  
List of sources for this discovery.  
Must be a list of ids as defined in the [taxonomies index file](./TAXONOMY.md).
Example:
```yaml
sources:
  - devseed
```

**featured**  
`boolean`  
Whether this discovery is featured

![](./media/fm-featured-discovery.png)

**related**  
`Related[]`  
List of related contents. This list will be displayed at the bottom of discovery page like below.  
(The example shows the case when there are 3 related content entries.)

![screenshot of related content component on discovery page](./media/related-content-discovery.jpg)

Each content should be formatted like below

```yaml
  - type: dataset
    id: dataset-id
  - type: discovery
    id: discovery-id
```