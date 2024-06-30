@echo off
setlocal

rem Set the compiler and flags
set CXX=cl
set CXXFLAGS=/EHsc /I include  /I src  /link /out:file_compression_server.exe

rem Set directories
set SRC_DIR=src
set OBJ_DIR=obj
set BIN_DIR=bin

rem Create necessary directories
if not exist %OBJ_DIR% mkdir %OBJ_DIR%
if not exist %BIN_DIR% mkdir %BIN_DIR%

rem Compile source files
for %%f in (%SRC_DIR%\*.cpp) do (
    set SRC_FILE=%%f
    set OBJ_FILE=%OBJ_DIR%\%%~nf.obj
    %CXX% %CXXFLAGS% /c %%f /Fo%OBJ_FILE%
)

rem Link object files
set OBJ_FILES=
for %%f in (%OBJ_DIR%\*.obj) do (
    set OBJ_FILES=!OBJ_FILES! %%f
)

%CXX% %OBJ_FILES% /Fe%BIN_DIR%\file_compression_server.exe

endlocal
