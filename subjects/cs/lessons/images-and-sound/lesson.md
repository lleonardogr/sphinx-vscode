## Why it matters

A photo from your phone and a song in your playlist are also just numbers. Knowing how they are stored explains why a photo can take 6 MB, what "1080p" and "44.1 kHz" mean, and why compressed formats such as JPEG and MP3 exist.

## Images are grids of pixels

A digital image is a grid of tiny squares called **pixels**. A Full HD screen has 1920 × 1080 = 2,073,600 of them.

Each pixel stores a color as three numbers, how much **red**, **green** and **blue** light to mix, usually one byte each, from 0 to 255:

| Color | Red | Green | Blue | Hex |
|-------|-----|-------|------|-----|
| black | 0 | 0 | 0 | `#000000` |
| white | 255 | 255 | 255 | `#FFFFFF` |
| red | 255 | 0 | 0 | `#FF0000` |
| orange | 255 | 136 | 0 | `#FF8800` |

Three bytes are 24 bits, so a pixel can be one of 2²⁴ ≈ 16.7 million colors. Web colors are written in hex: two hex digits per byte.

The size of an uncompressed image is:

> width × height × bytes per pixel

A Full HD image takes 1920 × 1080 × 3 = 6,220,800 bytes, about 5.9 MiB. A 12-megapixel photo takes about 36 MB.

## Sound is a list of samples

Sound is a wave of air pressure. To store it, a microphone measures the wave many times per second; each measurement is a **sample**, a number:

- The **sample rate** is how many samples per second. CDs use 44,100 (44.1 kHz), a little more than twice the highest pitch people hear.
- The **bit depth** is how many bits per sample. CDs use 16 bits: 65,536 possible levels.
- **Channels**: 1 for mono, 2 for stereo.

The size of uncompressed sound is:

> sample rate × bytes per sample × channels × seconds

One minute of CD audio is 44,100 × 2 × 2 × 60 = 10,584,000 bytes, about 10 MB. A three-minute song is about 30 MB.

## Compression

Those sizes are why most media is **compressed**:

- **Lossless** formats (PNG, FLAC, ZIP) find patterns and store them more briefly, like writing "100 × blue" instead of "blue, blue, blue, …". The original comes back exactly.
- **Lossy** formats (JPEG, MP3, most video) also throw away details people barely notice. Files become 10 times smaller or more, but the original can't be recovered exactly.

A 30 MB song becomes a 3 MB MP3, and the 36 MB photo a 4 MB JPEG.

## Summary

- An image is a grid of pixels; each pixel is usually 3 bytes: red, green, blue.
- Hex colors such as `#FF8800` are those 3 bytes.
- Sound is stored as samples: rate × bytes per sample × channels × seconds.
- Compression makes media smaller: lossless keeps every bit, lossy drops details.
