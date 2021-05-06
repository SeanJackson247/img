# img
Utility for batch manipulation of images, comping and cropping on the command line

This tool is dependent on Node-Canvas

Purpose
I created this tool to help create animations using Gimp without having to rely on the GIMP GAP plugin. Also, sometimes it is nicer to do somethings on the command line.

Usage
node C:/img comp inputFileA.png inputFileB.png outputFile.png

The two inputs and the outputs can be files or folders of files, however if one of the inputs is a folder then the output must be a folder. The files in the resulting output folder are named using the names of the files in the first folder given as an argument.

The first command can be either comp or match.

Comp
The output is the result of laying inputB over inputA. Useful for applying a background to set of images.

Match
The output is the result of the first input, where every pixel is made transparent if the corresponding pixel is also transparent in the second input. This is useful for cropping lots of images.
