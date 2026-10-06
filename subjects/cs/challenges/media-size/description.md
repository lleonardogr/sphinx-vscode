# Media Size

Pictures and sound are stored as numbers too, so we can work out how much space they take **before compression**.

- An **image** is a grid of pixels. Each pixel takes a number of bits: 24 bits (one byte each for red, green and blue) in a typical photo. Size = width × height × bits per pixel.
- **Sound** is stored as samples: measurements of the sound wave taken many times per second. Size = samples per second × bits per sample × channels × seconds. CD quality is 44,100 samples per second, 16 bits, 2 channels (stereo).

Read a description of an image or a recording and print its size.

**Input**

One line, either `image W H BITS` (width, height and bits per pixel) or `audio RATE BITS CHANNELS SECONDS`. All numbers are whole and positive.

**Output**

`N bytes (M MiB)`: the size in bytes (bits ÷ 8, rounded up) and in MiB (bytes ÷ 1,048,576) with 2 decimals.

**Things to know**

- Calculate in `long`: an hour of studio-quality sound is more than 8 billion bits.
- `(bits + 7) / 8` divides by 8 and rounds up.
- A MiB is 1024 × 1024 bytes. Divide as a `double` to keep the decimals.
