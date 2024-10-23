import { Glob } from 'bun'
import { join, extname, sep, basename } from 'path'
import sharp from 'sharp'
import css from './theme.css' with { type: "text" }
import htmlTemplate from './index.html' with { type: "text" }

sharp.simd(false)

const server = Bun.serve({
    port: 3000,
    async fetch(req) {

        const path = new URL(req.url).pathname

        if (path === '/robots.txt') return new Response(`User-agent: *
Disallow: /`, { headers: { "Content-Type": 'text/plain' } })

        const ext = extname(path)
        if (path.startsWith('/thumb') && ext === '.webp') {

            const fullPath = join(process.cwd(), path.replace(/\.webp$/, '').replace('/thumb', ''))

            let s = sharp(await Bun.file(fullPath).arrayBuffer())

            const thumb = await s.resize(200, 200)
                .webp().toBuffer()
            return new Response(thumb)
        }
        if (path.startsWith('/down') && [".png", ".jpg", ".jpeg"].includes(ext)) {

            const fullPath = join(process.cwd(), path.replace(/\.webp$/, '').replace('/down', ''))
            const file = Bun.file(fullPath)
            return new Response(file, {
                headers: {
                    'Content-Disposition': `attachment; filename="${basename(fullPath)}"`
                }
            })
        }
        if (path.startsWith('/down') && [".zip"].includes(ext)) {

            const fullPath = join(process.cwd(), path.replace('/down', ''))
            const file = Bun.file(fullPath)
            return new Response(file, {
                headers: {
                    'Content-Disposition': `attachment; filename="${basename(fullPath)}"`
                }
            })
        }

        if (path === '/') {
            const glob = new Glob('**/*.{png,jpg,jpeg}')
            const filesByDirectory: { [key: string]: string[] } = {}
            Array.from(glob.scanSync({ absolute: true })).filter(f => !f.includes('node_modules')).forEach(file => {
                const directory = file.split(sep).slice(-2, -1).join('/') || '/'
                if (!filesByDirectory[directory]) filesByDirectory[directory] = []
                filesByDirectory[directory].push(file)
            })

            let filesTemplate = Object.entries(filesByDirectory).map(([dir, files], idx) => {
                return `<div class="my-8">
                <h2 class="text-2xl font-bold mb-8">${dir}</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-7 gap-4">
                ${files.map(f => `<div class="overflow-hidden max-w-md image">
            <img loading="lazy" src="/thumb${f.replace(process.cwd(), '').replaceAll('\\', '/')}.webp" alt="Image"
                class="w-full h-auto rounded  aspect-square object-cover">
            <div class="mt-1 flex justify-around text-sm *:cursor-pointer *:border-gray-500 *:text-gray-500">
                <a  href="/down/${f.replace(process.cwd(), '').replaceAll('\\', '/')}"
                    class="btn-download border px-6 py-0 rounded">دانلود</a>
            </div>
        </div>`).join('')}
               </div> </div>`
            }).join('')

            return new Response(htmlTemplate.replace('{{files}}', filesTemplate), {
                headers: {
                    "Content-Type": 'text/html; charset=utf-8'
                }
            })
        }

        if (path === '/theme.css') return new Response(css, {
            headers: {
                "Content-Type": 'text/css; charset=utf-8'
            }
        })

        return new Response()
    },
});

console.log(`Listening on localhost: ${server.port}`);