"use client"
import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { createPortal } from 'react-dom';

/**
 * InstiPass ID Template Editor
 * 
 * A comprehensive, interactive component for institutions to design and edit ID templates
 * with 3D preview capabilities for both front and back sides.
 * 
 * Features:
 * - Drag and drop interface for element positioning
 * - Front/back toggle for editing both sides
 * - Support for text, images, logos, QR codes, barcodes
 * - Theme customization
 * - Dimension controls
 * - Export to JSON for database storage
 */

// Element types supported in the template
const ELEMENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  LOGO: 'logo',
  QRCODE: 'qrcode',
  BARCODE: 'barcode',
  SHAPE: 'shape'
};

// Default template dimensions (standard ID card size)
const DEFAULT_DIMENSIONS = {
  width: 340, // 3.4 inches * 100
  height: 210 // 2.1 inches * 100
};

// Default theme colors
const DEFAULT_THEME = {
  primary: '#1D3557',
  secondary: '#2A9D8F',
  background: '#FFFFFF',
  text: '#000000',
  accent: '#E63946'
};

// Default template element
const createDefaultElement = (type, id) => {
  const baseElement = {
    id: id || `element-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    x: 50,
    y: 50,
    width: 100,
    height: type === ELEMENT_TYPES.TEXT ? 30 : 100,
    rotation: 0,
    zIndex: 1,
    locked: false
  };

  switch (type) {
    case ELEMENT_TYPES.TEXT:
      return {
        ...baseElement,
        content: 'Text Field',
        style: {
          color: '#000000',
          fontSize: 16,
          fontFamily: 'Arial',
          fontWeight: 'normal',
          textAlign: 'left',
          backgroundColor: 'transparent'
        },
        fieldMapping: '' // For dynamic content like {{student.name}}
      };
    
    case ELEMENT_TYPES.IMAGE:
      return {
        ...baseElement,
        content: '',
        placeholder: 'Student Photo',
        style: {
          objectFit: 'cover',
          borderRadius: 0,
          borderWidth: 0,
          borderColor: '#000000'
        },
        fieldMapping: '{{student.photo}}'
      };
    
    case ELEMENT_TYPES.LOGO:
      return {
        ...baseElement,
        content: '',
        placeholder: 'Institution Logo',
        style: {
          objectFit: 'contain'
        }
      };
    
    case ELEMENT_TYPES.QRCODE:
      return {
        ...baseElement,
        content: 'https://example.com/student/123456',
        style: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          padding: 10
        },
        fieldMapping: '{{student.id}}'
      };
    
    case ELEMENT_TYPES.BARCODE:
      return {
        ...baseElement,
        content: '123456789',
        barcodeType: 'code128',
        style: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          includeText: true
        },
        fieldMapping: '{{student.id}}'
      };
    
    case ELEMENT_TYPES.SHAPE:
      return {
        ...baseElement,
        shapeType: 'rectangle',
        style: {
          backgroundColor: '#2A9D8F',
          borderRadius: 0,
          borderWidth: 0,
          borderColor: '#000000',
          opacity: 1
        }
      };
    
    default:
      return baseElement;
  }
};

// Create empty template
const createEmptyTemplate = () => ({
  front: {
    elements: [],
    backgroundColor: '#FFFFFF'
  },
  back: {
    elements: [],
    backgroundColor: '#FFFFFF'
  },
  dimensions: { ...DEFAULT_DIMENSIONS },
  theme: { ...DEFAULT_THEME }
});

// Helper to get cursor position in an element
const getCursorPosition = (event, element) => {
  const rect = element.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
};

// Main component
const IDTemplateEditor = ({ 
  initialTemplate = null,
  onChange = () => {},
  onSave = () => {}
}) => {
  // State for the template
  const [template, setTemplate] = useState(initialTemplate || createEmptyTemplate());
  
  // Current side being edited (front or back)
  const [currentSide, setCurrentSide] = useState('front');
  
  // Selected element
  const [selectedElementId, setSelectedElementId] = useState(null);
  
  // Color picker state
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerTarget, setColorPickerTarget] = useState(null);
  const [colorPickerProperty, setColorPickerProperty] = useState(null);
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  
  // Refs
  const canvasRef = useRef(null);
  const colorPickerRef = useRef(null);
  
  // Get current elements
  const currentElements = template[currentSide].elements;
  
  // Find selected element
  const selectedElement = currentElements.find(el => el.id === selectedElementId);
  
  // Update template and notify parent
  const updateTemplate = (newTemplate) => {
    setTemplate(newTemplate);
    onChange(newTemplate);
  };
  
  // Update current side
  const updateCurrentSide = (updates) => {
    updateTemplate({
      ...template,
      [currentSide]: {
        ...template[currentSide],
        ...updates
      }
    });
  };
  
  // Add a new element
  const addElement = (type) => {
    const newElement = createDefaultElement(type);
    
    updateCurrentSide({
      elements: [...currentElements, newElement]
    });
    
    setSelectedElementId(newElement.id);
  };
  
  // Update an element
  const updateElement = (id, updates) => {
    const updatedElements = currentElements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    
    updateCurrentSide({ elements: updatedElements });
  };
  
  // Update element style
  const updateElementStyle = (id, property, value) => {
    const element = currentElements.find(el => el.id === id);
    if (!element) return;
    
    updateElement(id, {
      style: {
        ...element.style,
        [property]: value
      }
    });
  };
  
  // Delete an element
  const deleteElement = (id) => {
    updateCurrentSide({
      elements: currentElements.filter(el => el.id !== id)
    });
    
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };
  
  // Handle color picker open
  const handleColorPickerOpen = (property, target = 'element') => {
    setColorPickerProperty(property);
    setColorPickerTarget(target);
    setShowColorPicker(true);
  };
  
  // Handle color change
  const handleColorChange = (color) => {
    const { hex } = color;
    
    if (colorPickerTarget === 'element' && selectedElementId) {
      updateElementStyle(selectedElementId, colorPickerProperty, hex);
    } else if (colorPickerTarget === 'background') {
      updateCurrentSide({ backgroundColor: hex });
    } else if (colorPickerTarget === 'theme') {
      updateTemplate({
        ...template,
        theme: {
          ...template.theme,
          [colorPickerProperty]: hex
        }
      });
    }
  };
  
  // Handle mouse down on element (start drag)
  const handleElementMouseDown = (event, element) => {
    if (element.locked) return;
    
    // Select the element
    setSelectedElementId(element.id);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const cursorPos = {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top
    };
    
    // Check if we're on a resize handle
    const handleSize = 10;
    const isOnRightHandle = Math.abs(cursorPos.x - (element.x + element.width)) < handleSize;
    const isOnBottomHandle = Math.abs(cursorPos.y - (element.y + element.height)) < handleSize;
    const isOnLeftHandle = Math.abs(cursorPos.x - element.x) < handleSize;
    const isOnTopHandle = Math.abs(cursorPos.y - element.y) < handleSize;
    
    if (isOnRightHandle || isOnBottomHandle || isOnLeftHandle || isOnTopHandle) {
      // Start resizing
      setIsResizing(true);
      setResizeDirection({
        right: isOnRightHandle,
        bottom: isOnBottomHandle,
        left: isOnLeftHandle,
        top: isOnTopHandle
      });
      setInitialSize({
        width: element.width,
        height: element.height
      });
      setInitialPosition({
        x: element.x,
        y: element.y
      });
    } else {
      // Start dragging
      setIsDragging(true);
      setDragOffset({
        x: cursorPos.x - element.x,
        y: cursorPos.y - element.y
      });
    }
    
    event.stopPropagation();
  };
  
  // Handle mouse move (drag or resize)
  const handleCanvasMouseMove = (event) => {
    if (!isDragging && !isResizing) return;
    
    const canvas = canvasRef.current;
    if (!canvas || !selectedElementId) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const cursorPos = {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top
    };
    
    if (isDragging) {
      // Update element position
      updateElement(selectedElementId, {
        x: cursorPos.x - dragOffset.x,
        y: cursorPos.y - dragOffset.y
      });
    } else if (isResizing) {
      // Calculate new size and position
      let newWidth = initialSize.width;
      let newHeight = initialSize.height;
      let newX = initialPosition.x;
      let newY = initialPosition.y;
      
      if (resizeDirection.right) {
        newWidth = Math.max(20, cursorPos.x - initialPosition.x);
      }
      
      if (resizeDirection.bottom) {
        newHeight = Math.max(20, cursorPos.y - initialPosition.y);
      }
      
      if (resizeDirection.left) {
        const deltaX = initialPosition.x - cursorPos.x;
        newWidth = Math.max(20, initialSize.width + deltaX);
        newX = initialPosition.x - deltaX;
      }
      
      if (resizeDirection.top) {
        const deltaY = initialPosition.y - cursorPos.y;
        newHeight = Math.max(20, initialSize.height + deltaY);
        newY = initialPosition.y - deltaY;
      }
      
      // Update element
      updateElement(selectedElementId, {
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY
      });
    }
  };
  
  // Handle mouse up (end drag or resize)
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };
  
  // Handle canvas click (deselect)
  const handleCanvasClick = (event) => {
    if (event.target === canvasRef.current) {
      setSelectedElementId(null);
    }
  };
  
  // Update dimensions
  const updateDimensions = (property, value) => {
    updateTemplate({
      ...template,
      dimensions: {
        ...template.dimensions,
        [property]: parseInt(value, 10) || 0
      }
    });
  };
  
  // Toggle element lock
  const toggleElementLock = (id) => {
    const element = currentElements.find(el => el.id === id);
    if (!element) return;
    
    updateElement(id, { locked: !element.locked });
  };
  
  // Save template
  const handleSave = () => {
    onSave(template);
  };
  
  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Render element based on type
  const renderElement = (element) => {
    const { type, x, y, width, height, rotation, style, content, locked } = element;
    
    const baseStyle = {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
      transform: rotation ? `rotate(${rotation}deg)` : undefined,
      cursor: locked ? 'not-allowed' : 'move',
      border: selectedElementId === element.id ? '2px dashed #2A9D8F' : undefined,
      zIndex: element.zIndex || 1
    };
    
    switch (type) {
      case ELEMENT_TYPES.TEXT:
        return (
          <div
            style={{
              ...baseStyle,
              color: style.color,
              fontSize: `${style.fontSize}px`,
              fontFamily: style.fontFamily,
              fontWeight: style.fontWeight,
              textAlign: style.textAlign,
              backgroundColor: style.backgroundColor,
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            {content}
            {element.fieldMapping && (
              <span style={{ fontSize: '10px', opacity: 0.7, marginLeft: '4px' }}>
                ({element.fieldMapping})
              </span>
            )}
          </div>
        );
      
      case ELEMENT_TYPES.IMAGE:
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: '#f0f0f0',
              border: `${style.borderWidth || 0}px solid ${style.borderColor || '#000'}`,
              borderRadius: `${style.borderRadius || 0}px`,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            {content ? (
              <img
                src={content}
                alt="Student"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: style.objectFit || 'cover'
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '8px' }}>
                {element.placeholder || 'Student Photo'}
              </div>
            )}
          </div>
        );
      
      case ELEMENT_TYPES.LOGO:
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: '#f0f0f0',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            {content ? (
              <img
                src={content}
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: style.objectFit || 'contain'
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '8px' }}>
                {element.placeholder || 'Institution Logo'}
              </div>
            )}
          </div>
        );
      
      case ELEMENT_TYPES.QRCODE:
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: style.backgroundColor || '#FFFFFF',
              padding: `${style.padding || 0}px`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              color: '#000000',
              fontSize: '10px',
              textAlign: 'center'
            }}>
              QR Code<br />
              {element.fieldMapping || content}
            </div>
          </div>
        );
      
      case ELEMENT_TYPES.BARCODE:
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: style.backgroundColor || '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          >
            <div style={{ 
              width: '100%', 
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFFFF',
              backgroundImage: 'repeating-linear-gradient(90deg, #000, #000 2px, #fff 2px, #fff 4px)',
              backgroundSize: '100% 60%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }} />
            {style.includeText && (
              <div style={{ 
                padding: '2px 0',
                fontSize: '10px',
                color: style.foregroundColor || '#000000'
              }}>
                {element.fieldMapping || content}
              </div>
            )}
          </div>
        );
      
      case ELEMENT_TYPES.SHAPE:
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: style.backgroundColor,
              borderRadius: `${style.borderRadius || 0}px`,
              border: `${style.borderWidth || 0}px solid ${style.borderColor || '#000'}`,
              opacity: style.opacity
            }}
            onMouseDown={(e) => handleElementMouseDown(e, element)}
          />
        );
      
      default:
        return null;
    }
  };
  
  // Render resize handles for selected element
  const renderResizeHandles = () => {
    if (!selectedElement || selectedElement.locked) return null;
    
    const { x, y, width, height } = selectedElement;
    const handleSize = 8;
    
    const handleStyle = {
      position: 'absolute',
      width: `${handleSize}px`,
      height: `${handleSize}px`,
      backgroundColor: '#2A9D8F',
      border: '1px solid white',
      zIndex: 10
    };
    
    return (
      <>
        {/* Top-left */}
        <div style={{
          ...handleStyle,
          left: `${x - handleSize / 2}px`,
          top: `${y - handleSize / 2}px`,
          cursor: 'nwse-resize'
        }} />
        
        {/* Top-right */}
        <div style={{
          ...handleStyle,
          left: `${x + width - handleSize / 2}px`,
          top: `${y - handleSize / 2}px`,
          cursor: 'nesw-resize'
        }} />
        
        {/* Bottom-left */}
        <div style={{
          ...handleStyle,
          left: `${x - handleSize / 2}px`,
          top: `${y + height - handleSize / 2}px`,
          cursor: 'nesw-resize'
        }} />
        
        {/* Bottom-right */}
        <div style={{
          ...handleStyle,
          left: `${x + width - handleSize / 2}px`,
          top: `${y + height - handleSize / 2}px`,
          cursor: 'nwse-resize'
        }} />
        
        {/* Top */}
        <div style={{
          ...handleStyle,
          left: `${x + width / 2 - handleSize / 2}px`,
          top: `${y - handleSize / 2}px`,
          cursor: 'ns-resize'
        }} />
        
        {/* Right */}
        <div style={{
          ...handleStyle,
          left: `${x + width - handleSize / 2}px`,
          top: `${y + height / 2 - handleSize / 2}px`,
          cursor: 'ew-resize'
        }} />
        
        {/* Bottom */}
        <div style={{
          ...handleStyle,
          left: `${x + width / 2 - handleSize / 2}px`,
          top: `${y + height - handleSize / 2}px`,
          cursor: 'ns-resize'
        }} />
        
        {/* Left */}
        <div style={{
          ...handleStyle,
          left: `${x - handleSize / 2}px`,
          top: `${y + height / 2 - handleSize / 2}px`,
          cursor: 'ew-resize'
        }} />
      </>
    );
  };
  
  return (
    <div className="id-template-editor" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '12px', 
        backgroundColor: template.theme.primary, 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>ID Template Editor</h2>
        <button 
          onClick={handleSave}
          style={{
            backgroundColor: template.theme.secondary,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          Save Template
        </button>
      </div>
      
      {/* Main content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left sidebar - Tools */}
        <div style={{ 
          width: '60px', 
          backgroundColor: '#f5f5f5', 
          borderRight: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 0'
        }}>
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <small style={{ fontSize: '10px', color: '#666' }}>Add</small>
          </div>
          
          <button 
            onClick={() => addElement(ELEMENT_TYPES.TEXT)}
            style={{
              width: '40px',
              height: '40px',
              margin: '4px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            title="Add Text"
          >
            T
          </button>
          
          <button 
            onClick={() => addElement(ELEMENT_TYPES.IMAGE)}
            style={{
              width: '40px',
              height: '40px',
              margin: '4px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            title="Add Image"
          >
            🖼️
          </button>
          
          <button 
            onClick={() => addElement(ELEMENT_TYPES.LOGO)}
            style={{
              width: '40px',
              height: '40px',
              margin: '4px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            title="Add Logo"
          >
            🏢
          </button>
          
          <button 
            onClick={() => addElement(ELEMENT_TYPES.QRCODE)}
            style={{
              width: '40px',
              height: '40px',
              margin: '4px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '20px'
            }}
            title="Add QR Code"
          >
            📱
          </button>
          
          <button 
            onClick={() => addElement(ELEMENT_TYPES.BARCODE)}
            style={{
              width: '40px',
              height: '40px',
              margin: '4px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            title="Add Barcode"
          >
            |||
          </button>
          
          <button 
            onClick={() => addElement(ELEMENT_TYPES.SHAPE)}
            style={{
              width: '40px',
              height: '40px',
              margin: '4px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            title="Add Shape"
          >
            ■
          </button>
        </div>
        
        {/* Center - Canvas */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#e9e9e9', 
          padding: '20px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Card toggle */}
          <div style={{ 
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => setCurrentSide('front')}
              style={{
                padding: '8px 16px',
                backgroundColor: currentSide === 'front' ? template.theme.secondary : '#f5f5f5',
                color: currentSide === 'front' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '4px 0 0 4px',
                cursor: 'pointer'
              }}
            >
              Front
            </button>
            <button
              onClick={() => setCurrentSide('back')}
              style={{
                padding: '8px 16px',
                backgroundColor: currentSide === 'back' ? template.theme.secondary : '#f5f5f5',
                color: currentSide === 'back' ? 'white' : '#333',
                border: '1px solid #ddd',
                borderLeft: 'none',
                borderRadius: '0 4px 4px 0',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
          </div>
          
          {/* Canvas */}
          <div
            ref={canvasRef}
            style={{
              position: 'relative',
              width: `${template.dimensions.width}px`,
              height: `${template.dimensions.height}px`,
              backgroundColor: template[currentSide].backgroundColor,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            {/* Render all elements */}
            {currentElements.map(element => renderElement(element))}
            
            {/* Render resize handles for selected element */}
            {renderResizeHandles()}
          </div>
          
          {/* Dimensions */}
          <div style={{ 
            marginTop: '16px',
            display: 'flex',
            gap: '16px'
          }}>
            <div>
              <label style={{ fontSize: '12px', marginRight: '8px' }}>Width:</label>
              <input
                type="number"
                value={template.dimensions.width}
                onChange={(e) => updateDimensions('width', e.target.value)}
                style={{
                  width: '60px',
                  padding: '4px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              <span style={{ fontSize: '12px', marginLeft: '4px' }}>px</span>
            </div>
            <div>
              <label style={{ fontSize: '12px', marginRight: '8px' }}>Height:</label>
              <input
                type="number"
                value={template.dimensions.height}
                onChange={(e) => updateDimensions('height', e.target.value)}
                style={{
                  width: '60px',
                  padding: '4px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              <span style={{ fontSize: '12px', marginLeft: '4px' }}>px</span>
            </div>
            <div>
              <button
                onClick={() => handleColorPickerOpen('backgroundColor', 'background')}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px'
                }}
              >
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  backgroundColor: template[currentSide].backgroundColor,
                  border: '1px solid #ddd',
                  marginRight: '4px'
                }} />
                Background
              </button>
            </div>
          </div>
        </div>
        
        {/* Right sidebar - Properties */}
        <div style={{ 
          width: '240px', 
          backgroundColor: 'white', 
          borderLeft: '1px solid #ddd',
          overflow: 'auto',
          padding: '16px'
        }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '16px',
            borderBottom: '1px solid #eee',
            paddingBottom: '8px'
          }}>
            {selectedElement ? 'Element Properties' : 'Template Properties'}
          </h3>
          
          {selectedElement ? (
            <div>
              {/* Element type */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Type
                </label>
                <div style={{ 
                  padding: '6px 8px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  {selectedElement.type.charAt(0).toUpperCase() + selectedElement.type.slice(1)}
                </div>
              </div>
              
              {/* Position */}
              <div style={{ 
                display: 'flex', 
                gap: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px',
                    fontSize: '12px'
                  }}>
                    X Position
                  </label>
                  <input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) => updateElement(selectedElement.id, { x: parseInt(e.target.value, 10) || 0 })}
                    disabled={selectedElement.locked}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px',
                    fontSize: '12px'
                  }}>
                    Y Position
                  </label>
                  <input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) => updateElement(selectedElement.id, { y: parseInt(e.target.value, 10) || 0 })}
                    disabled={selectedElement.locked}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
              
              {/* Size */}
              <div style={{ 
                display: 'flex', 
                gap: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px',
                    fontSize: '12px'
                  }}>
                    Width
                  </label>
                  <input
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value, 10) || 0 })}
                    disabled={selectedElement.locked}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '4px',
                    fontSize: '12px'
                  }}>
                    Height
                  </label>
                  <input
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value, 10) || 0 })}
                    disabled={selectedElement.locked}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
              
              {/* Rotation */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px',
                  fontSize: '12px'
                }}>
                  Rotation (degrees)
                </label>
                <input
                  type="number"
                  value={selectedElement.rotation || 0}
                  onChange={(e) => updateElement(selectedElement.id, { rotation: parseInt(e.target.value, 10) || 0 })}
                  disabled={selectedElement.locked}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              {/* Z-Index */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px',
                  fontSize: '12px'
                }}>
                  Layer (Z-Index)
                </label>
                <input
                  type="number"
                  value={selectedElement.zIndex || 1}
                  onChange={(e) => updateElement(selectedElement.id, { zIndex: parseInt(e.target.value, 10) || 1 })}
                  disabled={selectedElement.locked}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              {/* Type-specific properties */}
              {selectedElement.type === ELEMENT_TYPES.TEXT && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px',
                      fontSize: '12px'
                    }}>
                      Text Content
                    </label>
                    <input
                      type="text"
                      value={selectedElement.content}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      disabled={selectedElement.locked}
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px',
                      fontSize: '12px'
                    }}>
                      Field Mapping
                    </label>
                    <input
                      type="text"
                      value={selectedElement.fieldMapping || ''}
                      onChange={(e) => updateElement(selectedElement.id, { fieldMapping: e.target.value })}
                      disabled={selectedElement.locked}
                      placeholder="e.g. {{student.name}}"
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px',
                      fontSize: '12px'
                    }}>
                      Font Size
                    </label>
                    <input
                      type="number"
                      value={selectedElement.style.fontSize}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'fontSize', parseInt(e.target.value, 10) || 12)}
                      disabled={selectedElement.locked}
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px',
                      fontSize: '12px'
                    }}>
                      Font Family
                    </label>
                    <select
                      value={selectedElement.style.fontFamily}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'fontFamily', e.target.value)}
                      disabled={selectedElement.locked}
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px',
                      fontSize: '12px'
                    }}>
                      Text Align
                    </label>
                    <select
                      value={selectedElement.style.textAlign}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'textAlign', e.target.value)}
                      disabled={selectedElement.locked}
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px',
                      fontSize: '12px'
                    }}>
                      Text Color
                    </label>
                    <button
                      onClick={() => handleColorPickerOpen('color')}
                      disabled={selectedElement.locked}
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        backgroundColor: selectedElement.style.color,
                        border: '1px solid #ddd',
                        marginRight: '8px'
                      }} />
                      {selectedElement.style.color}
                    </button>
                  </div>
                </>
              )}
              
              {selectedElement.type === ELEMENT_TYPES.IMAGE && (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px',
                      fontSize: '12px'
                    }}>
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={selectedElement.content}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      disabled={selectedElement.locked}
                      placeholder="https://example.com/image.jpg"
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px',
                      fontSize: '12px'
                    }}>
                      Field Mapping
                    </label>
                    <input
                      type="text"
                      value={selectedElement.fieldMapping || ''}
                      onChange={(e) => updateElement(selectedElement.id, { fieldMapping: e.target.value })}
                      disabled={selectedElement.locked}
                      placeholder="e.g. {{student.photo}}"
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px',
                      fontSize: '12px'
                    }}>
                      Object Fit
                    </label>
                    <select
                      value={selectedElement.style.objectFit || 'cover'}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'objectFit', e.target.value)}
                      disabled={selectedElement.locked}
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    >
                      <option value="cover">Cover</option>
                      <option value="contain">Contain</option>
                      <option value="fill">Fill</option>
                    </select>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '4px',
                      fontSize: '12px'
                    }}>
                      Border Radius
                    </label>
                    <input
                      type="number"
                      value={selectedElement.style.borderRadius || 0}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'borderRadius', parseInt(e.target.value, 10) || 0)}
                      disabled={selectedElement.locked}
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </>
              )}
              
              {/* Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '8px',
                marginTop: '24px'
              }}>
                <button
                  onClick={() => toggleElementLock(selectedElement.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: selectedElement.locked ? '#f5f5f5' : 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {selectedElement.locked ? '🔓 Unlock' : '🔒 Lock'}
                </button>
                <button
                  onClick={() => deleteElement(selectedElement.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Theme colors */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Theme Colors
                </label>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      backgroundColor: template.theme.primary,
                      marginRight: '8px'
                    }} />
                    <span style={{ fontSize: '12px' }}>Primary</span>
                  </div>
                  <button
                    onClick={() => handleColorPickerOpen('primary', 'theme')}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '12px'
                    }}
                  >
                    {template.theme.primary}
                  </button>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      backgroundColor: template.theme.secondary,
                      marginRight: '8px'
                    }} />
                    <span style={{ fontSize: '12px' }}>Secondary</span>
                  </div>
                  <button
                    onClick={() => handleColorPickerOpen('secondary', 'theme')}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '12px'
                    }}
                  >
                    {template.theme.secondary}
                  </button>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      backgroundColor: template.theme.accent,
                      marginRight: '8px'
                    }} />
                    <span style={{ fontSize: '12px' }}>Accent</span>
                  </div>
                  <button
                    onClick={() => handleColorPickerOpen('accent', 'theme')}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '12px'
                    }}
                  >
                    {template.theme.accent}
                  </button>
                </div>
              </div>
              
              {/* Background color */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  Background Color
                </label>
                <button
                  onClick={() => handleColorPickerOpen('backgroundColor', 'background')}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: template[currentSide].backgroundColor,
                    border: '1px solid #ddd',
                    marginRight: '8px'
                  }} />
                  {template[currentSide].backgroundColor}
                </button>
              </div>
              
              {/* Template info */}
              <div style={{ 
                marginTop: '24px',
                padding: '12px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                <p style={{ margin: '0 0 8px 0' }}>
                  <strong>Current side:</strong> {currentSide}
                </p>
                <p style={{ margin: '0 0 8px 0' }}>
                  <strong>Elements:</strong> {currentElements.length}
                </p>
                <p style={{ margin: '0' }}>
                  <strong>Dimensions:</strong> {template.dimensions.width} × {template.dimensions.height} px
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Color picker portal */}
      {showColorPicker && createPortal(
        <div
          ref={colorPickerRef}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <h4 style={{ margin: 0, fontSize: '14px' }}>
              Select Color
            </h4>
            <button
              onClick={() => setShowColorPicker(false)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px'
              }}
            >
              ×
            </button>
          </div>
          <SketchPicker
            color={colorPickerTarget === 'element' && selectedElementId
              ? selectedElement.style[colorPickerProperty]
              : colorPickerTarget === 'background'
                ? template[currentSide].backgroundColor
                : template.theme[colorPickerProperty]
            }
            onChange={handleColorChange}
          />
        </div>,
        document.body
      )}
    </div>
  );
};

export default IDTemplateEditor;
