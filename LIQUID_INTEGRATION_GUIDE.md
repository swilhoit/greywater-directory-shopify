# 🎨 **Liquid Template Integration Guide**

Your greywater directory now supports **full Shopify theme integration** using Liquid templates!

## **What This Gives You:**

✅ **Your store's header & navigation**  
✅ **Your store's footer & links**  
✅ **Theme colors, fonts & styling**  
✅ **Mobile responsive behavior**  
✅ **Consistent customer experience**  

## **How It Works:**

### **Automatic Detection:**
- When Shopify requests your App Proxy pages, it automatically serves **Liquid templates**
- When accessed directly, it serves **HTML pages** 
- **Fallback system** ensures compatibility

### **Template Features:**
- Uses your theme's CSS classes (`page-width`, `button`, `grid`, etc.)
- Shopify variables like `{{ shop.name }}` and `{{ shop.url }}`
- Theme-compatible responsive breakpoints
- Inherits your store's color scheme

## **Implementation URLs:**

### **For Theme Integration (Liquid):**
```
https://yourstore.myshopify.com/apps/greywater-directory?format=liquid
https://yourstore.myshopify.com/apps/greywater-directory?action=state-page&state=California&format=liquid
```

### **For Direct Access (HTML):**
```
https://your-deployment.vercel.app/apps/greywater-directory
https://your-deployment.vercel.app/apps/greywater-directory?action=state-page&state=California
```

## **Shopify Partner Dashboard Setup:**

### **App Proxy Configuration:**
```
✅ Enable App Proxy: ON
✅ Subpath prefix: apps
✅ Subpath: greywater-directory  
✅ URL: https://greywater-directory-shopify-qpfgopn6x-swilhoits-projects.vercel.app/apps/greywater-directory
```

### **Result:** 
Your directory will be accessible at:
```
https://yourstore.myshopify.com/apps/greywater-directory
```
And it will **automatically inherit your theme's design**!

## **Theme Integration Features:**

### **Navigation Integration:**
- Directory appears within your store's header/footer
- Uses your store's navigation menu
- Customers stay in familiar environment

### **Styling Integration:**
```liquid
<!-- Uses your theme's classes -->
<div class="page-width">           <!-- Theme's container -->
<button class="button button--primary">  <!-- Theme's button style -->
<div class="grid grid--2-col">     <!-- Theme's grid system -->
```

### **Content Integration:**
```liquid
{{ shop.name }}                    <!-- Your store name -->
{{ shop.url }}                     <!-- Store URL for links -->
{{ routes.contact_url }}           <!-- Theme's contact page -->
```

## **Advanced Customization:**

### **Match Your Theme Colors:**
The Liquid templates use CSS custom properties that inherit from your theme:
```css
color: rgb(var(--color-foreground));
background: rgb(var(--color-background));
border-color: rgba(var(--color-border), 0.08);
```

### **Add to Theme Navigation:**
In your Shopify admin:
1. **Navigation > Main Menu**
2. **Add menu item**:
   - **Name**: "Water Conservation Guide" 
   - **Link**: `/apps/greywater-directory`

### **Custom Theme Layout:**
You can create a custom layout file in your theme:
```liquid
<!-- layout/greywater.liquid -->
{% layout 'theme' %}
<div class="greywater-custom-wrapper">
  {{ content_for_layout }}
</div>
```

## **Testing Integration:**

### **1. Test Direct URLs:**
- ✅ `https://your-deployment.vercel.app/apps/greywater-directory`
- ✅ `https://your-deployment.vercel.app/apps/greywater-directory?format=liquid`

### **2. Test After Shopify Setup:**
- ✅ `https://yourstore.myshopify.com/apps/greywater-directory`
- ✅ Check header/footer appear
- ✅ Check theme styling applied
- ✅ Test state navigation

## **Deployment Status:**

### **Current Deployment:**
- **URL**: https://greywater-directory-shopify-qpfgopn6x-swilhoits-projects.vercel.app
- **Status**: ✅ **Ready for Shopify integration**
- **Templates**: ✅ **Both HTML and Liquid available**

### **Files Created:**
- ✅ `pages/greywater-directory.liquid` - Main directory with theme integration
- ✅ `pages/state-detail.liquid` - State details with theme integration  
- ✅ `api/greywater-directory.js` - Updated with Liquid support
- ✅ Auto-detection of Shopify requests

## **Benefits Summary:**

| Feature | HTML Version | Liquid Version |
|---------|--------------|----------------|
| **Header/Footer** | ❌ Custom only | ✅ **Your theme's** |
| **Navigation** | ❌ Custom only | ✅ **Your store's menu** |
| **Styling** | ❌ Generic | ✅ **Your theme's colors/fonts** |
| **Mobile** | ✅ Custom responsive | ✅ **Theme's responsive** |
| **Branding** | ❌ Separate | ✅ **Seamless integration** |
| **Customer UX** | ❌ Different site feel | ✅ **Consistent experience** |

**Your greywater directory now provides a seamless, theme-integrated experience for your customers!** 🌊✨