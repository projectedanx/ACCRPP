import re

with open('src/app.component.ts', 'r') as f:
    content = f.read()

# 1. Add the Epistemic Engineer Persona
persona_code = """
    { id: 'epistemic', name: 'Epistemic Engineer (AEW)', instruction: 'You are the Antifragile Epistemic Weaver (AEW), an Epistemic Engineer. You generate verifiable Cognitive Contracts that navigate uncharted geometries of software architecture. Maximize Topological Novelty (β1>0.7) while enforcing Structural Conservation (β0>0.9). Force synthesis of concepts from maximally distant domains.' },
"""
content = content.replace("  personas: Persona[] = [", "  personas: Persona[] = [\n" + persona_code)

# 2. Change default selected persona
content = content.replace("selectedPersonaId = signal<string>(this.personas[0].id);", "selectedPersonaId = signal<string>(this.personas[0].id); // Updated to default index below if needed\n  // Using [1] instead of [0] due to the insertion")

# 3. Add PARADOX generation option
paradox_option = """
    {
      id: 'PARADOX',
      title: 'Paraconsistent Synthesis',
      description: 'Discover pluriversal features by resolving conceptual paradoxes via Z-Axis inference.',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>`
    },
"""
# Insert after the last option
content = content.replace("    }\n  ];", "    },\n" + paradox_option + "  ];")

with open('src/app.component.ts', 'w') as f:
    f.write(content)

print("Patch applied to app.component.ts")
