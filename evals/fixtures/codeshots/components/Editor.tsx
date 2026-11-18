type Block = { id: string; language: string; code: string }

export function Editor({ blocks }: { blocks: Block[] }) {
  return (
    <div className="editor">
      {blocks.map((block) => (
        <figure key={block.id} className="editor-block">
          <figcaption>{block.language}</figcaption>
          <pre>
            <code>{block.code}</code>
          </pre>
        </figure>
      ))}
    </div>
  )
}
