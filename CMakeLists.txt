cmake_minimum_required(VERSION 3.9)
cmake_policy(SET CMP0042 NEW)
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

project(node-libsharedmemory)

include_directories("include" "node_modules/cpp_libsharedmemory/include/libsharedmemory")

# node_api.h, napi.h etc.
# usually defaults to ~/.cmake-js/node-$arch/v$version/include/node
include_directories(${CMAKE_JS_INC})

file(GLOB SOURCE_FILES "src/node-libsharedmemory.cc")

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})

IF (WIN32)
    target_compile_options(node-libsharedmemory PRIVATE -W3 -EHsc)
else ()
    target_compile_options(node-libsharedmemory PRIVATE -Wall -Wno-missing-braces -std=c++11 -fPIC)
endif ()

execute_process(COMMAND node -p "require('node-addon-api').include"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_ADDON_API_DIR
        )
string(REGEX REPLACE "[\r\n\"]" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})

target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})

add_definitions(-DNAPI_VERSION=3)