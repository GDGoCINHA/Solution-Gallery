import { useState } from 'react';

interface ProjectFile {
  name: string;
  url: string;
}

interface ProjectFilesProps {
  files?: ProjectFile[];
}

function isPreviewable(fileName: string) {
  return /\.(pdf|docx?|pptx?)$/i.test(fileName);
}

export function ProjectFiles({ files }: ProjectFilesProps) {
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  if (!files || files.length === 0) {
    return (
      <section className="w-full max-w-4xl flex flex-col items-center mb-8 px-2 md:px-0">
        <div className="bg-zinc-900/80 text-zinc-100 rounded-lg p-6 w-full text-base md:text-lg leading-relaxed shadow text-center">
          <h3 className="text-lg font-semibold mb-3">첨부 자료</h3>
          <div className="text-zinc-400">등록된 첨부파일이 없습니다.</div>
        </div>
      </section>
    );
  }
  return (
    <section className="w-full max-w-4xl flex flex-col items-center mb-8 px-2 md:px-0">
      <div className="bg-zinc-900/80 text-zinc-100 rounded-lg p-6 w-full text-base md:text-lg leading-relaxed shadow">
        <h3 className="text-lg font-semibold mb-3">첨부 자료</h3>
        <ul className="space-y-2 mb-4">
          {files.map((file, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="truncate max-w-xs md:max-w-md">{file.name}</span>
              {isPreviewable(file.name) ? (
                <button
                  className="text-primary underline hover:text-primary/80 transition-colors"
                  onClick={() => setSelectedFile(file)}
                >
                  미리보기
                </button>
              ) : (
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 transition-colors">다운로드</a>
              )}
            </li>
          ))}
        </ul>
        {selectedFile && (
          <div className="w-full flex flex-col items-center mb-4">
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-2">
              <iframe
                src={selectedFile.url}
                title={selectedFile.name}
                className="w-full h-full min-h-[400px]"
                allow="autoplay; fullscreen"
              />
            </div>
            <button className="text-sm text-zinc-400 hover:text-primary underline" onClick={() => setSelectedFile(null)}>
              미리보기 닫기
            </button>
          </div>
        )}
      </div>
    </section>
  );
} 