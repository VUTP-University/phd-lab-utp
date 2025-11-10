/* ----- CONTENT FORM ----- */
import React from 'react';
import { Card } from './Card';
import { CardHeader } from './CardHeader';
import { CardContent } from './CardContent';

export default function ContentForm() {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <h2 className="text-xl font-semibold">Управление на съдържание</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Формата за съдържание ще бъде добавена тук...</p>
        </CardContent>
      </Card>
    );
  }