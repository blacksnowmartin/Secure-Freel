# SecureFreel
The vision of SecureFreel is to revolutionize freelance work by providing a secure, anonymous platform for clients and freelancers. Through Privado ID and M-Pesa integration, the platform ensures confidentiality, privacy, and seamless transactions, empowering both parties to collaborate efficiently without compromising on security or convenience.

Recent development is to migrate the project to Base and Stylus Arbitrum Chains.
I'll guide you through setting up the environment from scratch and importing the necessary modules to achieve the SecureFreel dashboard preview we created earlier. Let's go through this step-by-step.

Here's a step-by-step guide to set up your environment and import the necessary modules:

1. Set up a new Next.js project:
Open your terminal and run the following commands:

```shellscript
npx create-next-app@latest securefreel
cd securefreel
```

When prompted, choose the following options:

1. Would you like to use TypeScript? Yes
2. Would you like to use ESLint? Yes
3. Would you like to use Tailwind CSS? Yes
4. Would you like to use `src/` directory? Yes
5. Would you like to use App Router? Yes
6. Would you like to customize the default import alias? No



2. Install additional dependencies:
We'll need to install shadcn/ui components and Lucide icons. Run the following command:

```shellscript
npm install @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-tabs lucide-react
```


3. Set up shadcn/ui:
Initialize shadcn/ui in your project:

```shellscript
npx shadcn@latest init
```

When prompted, choose the following options:

1. Would you like to use TypeScript (recommended)? Yes
2. Which style would you like to use? › Default
3. Which color would you like to use as base color? › Slate
4. Where is your global CSS file? › › src/app/globals.css
5. Do you want to use CSS variables for colors? › Yes
6. Where is your tailwind.config.js located? › tailwind.config.js
7. Configure the import alias for components: › @/components
8. Configure the import alias for utils: › @/lib/utils
9. Are you using React Server Components? › Yes
10. Write configuration to components.json. Proceed? › Yes



4. Install required shadcn/ui components:
Run the following commands to add the necessary components:

```shellscript
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add tabs
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add label
```


5. Create the Dashboard component:
Create a new file at `src/components/Dashboard.tsx` and paste the code we created earlier into this file.
6. Update the main page:
Open `src/app/page.tsx` and replace its contents with the following:

```typescriptreact
import Dashboard from '@/components/Dashboard'

export default function Home() {
  return <Dashboard />
}
```


7. Import necessary modules:
At the top of your `src/components/Dashboard.tsx` file, ensure you have the following imports:

```typescriptreact
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Lock, UserCircle2, Plus, DollarSign } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
```

These imports should already be in place if you've copied the entire code from the previous response.


8. Run the development server:
Start your Next.js development server by running:

```shellscript
npm run dev
```

Your application should now be running at `http://localhost:3000`.




Now you have successfully set up the environment and imported all necessary modules to run the SecureFreel dashboard preview. You can access the dashboard by opening your browser and navigating to `http://localhost:3000`.




Feel free to ask if you need any clarification or have questions about any part of the setup or implementation!

https://gamma.app/docs/SecureFreel-The-Future-of-Decentralized-Freelance-Platforms-a9du1org6g9dtvk
